import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Student } from '../entities/student.entity';
import { CreatePaymentDto } from '../dto/payments/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Verify student exists
    const student = await this.studentsRepository.findOne({
      where: { id: createPaymentDto.studentId }
    });
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    // Generate receipt number if not provided
    const receiptNumber = createPaymentDto.receiptNumber || 
      `REC-${Date.now()}-${createPaymentDto.studentId}`;

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      receiptNumber,
      lessonsCount: createPaymentDto.lessonsCount || 0
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Update student's payment totals
    await this.updateStudentPaymentTotals(createPaymentDto.studentId);

    return savedPayment;
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      relations: ['student'],
      order: { paymentDate: 'DESC' }
    });
  }

  async findByStudent(studentId: number): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      where: { studentId },
      relations: ['student'],
      order: { paymentDate: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['student']
    });
    
    if (!payment) {
      throw new NotFoundException('الدفعة غير موجودة');
    }
    
    return payment;
  }

  async update(id: number, updatePaymentDto: any): Promise<Payment> {
    const payment = await this.findOne(id);
    const originalStudentId = payment.studentId;

    Object.assign(payment, updatePaymentDto);

    const savedPayment = await this.paymentsRepository.save(payment);

    // If studentId has changed, we need to update totals for both old and new students
    if (updatePaymentDto.studentId && updatePaymentDto.studentId !== originalStudentId) {
      await this.updateStudentPaymentTotals(originalStudentId);
      await this.updateStudentPaymentTotals(updatePaymentDto.studentId);
    } else {
      await this.updateStudentPaymentTotals(originalStudentId);
    }

    return savedPayment;
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    const studentId = payment.studentId;
    
    await this.paymentsRepository.remove(payment);
    
    // Update student's payment totals after deletion
    await this.updateStudentPaymentTotals(studentId);
  }

  private async updateStudentPaymentTotals(studentId: number): Promise<void> {
    // Get current student data
    const student = await this.studentsRepository.findOne({
      where: { id: studentId }
    });

    if (student) {
      // Calculate total paid amount
      const totalPaidResult = await this.paymentsRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.studentId = :studentId', { studentId })
        .andWhere('payment.status = :status', { status: 'completed' })
        .getRawOne();

      const totalAmountPaid = parseFloat(totalPaidResult.total) || 0;
      const totalLessonsPaid = Math.floor(totalAmountPaid / student.pricePerHour);

      // Calculate amount due (lessons completed but not paid for)
      const unpaidLessons = Math.max(0, student.totalLessonsCompleted - totalLessonsPaid);
      const totalAmountDue = unpaidLessons * student.pricePerHour;

      await this.studentsRepository.update(studentId, {
        totalAmountPaid,
        totalLessonsPaid,
        totalAmountDue
      });
    }
  }

  async getPaymentStats() {
    const [totalPayments, totalAmount] = await Promise.all([
      this.paymentsRepository.count(),
      this.paymentsRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.status = :status', { status: 'completed' })
        .getRawOne()
    ]);

    const today = new Date().toISOString().split('T')[0];
    const todayPayments = await this.paymentsRepository.count({
      where: { paymentDate: today, status: 'completed' }
    });

    const todayAmountResult = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.paymentDate = :today', { today })
      .andWhere('payment.status = :status', { status: 'completed' })
      .getRawOne();

    return {
      totalPayments,
      totalAmount: parseFloat(totalAmount.total) || 0,
      todayPayments,
      todayAmount: parseFloat(todayAmountResult.total) || 0
    };
  }

  async getPaymentsByDateRange(startDate: string, endDate: string): Promise<Payment[]> {
    return await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.student', 'student')
      .where('payment.paymentDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .orderBy('payment.paymentDate', 'DESC')
      .getMany();
  }

  async calculateStudentBalance(studentId: number) {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId }
    });
    
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    const totalPaidResult = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.lessonsCount)', 'lessonsCount')
      .addSelect('SUM(payment.amount)', 'amount')
      .where('payment.studentId = :studentId', { studentId })
      .andWhere('payment.status = :status', { status: 'completed' })
      .getRawOne();

    const lessonsPaid = parseInt(totalPaidResult.lessonsCount) || 0;
    const amountPaid = parseFloat(totalPaidResult.amount) || 0;
    const lessonsCompleted = student.totalLessonsCompleted;
    const lessonsRemaining = Math.max(0, lessonsPaid - lessonsCompleted);
    const amountDue = Math.max(0, lessonsCompleted - lessonsPaid) * student.pricePerHour;

    return {
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      lessonsPaid,
      lessonsCompleted,
      lessonsRemaining,
      amountPaid,
      amountDue
    };
  }
}
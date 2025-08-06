import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/students/create-student.dto';
import { UpdateStudentDto } from '../dto/students/update-student.dto';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @Inject(LessonsService)
    private lessonsService: LessonsService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if phone number already exists
    const existingByPhone = await this.studentsRepository.findOne({
      where: { phoneNumber: createStudentDto.phoneNumber }
    });
    if (existingByPhone) {
      throw new ConflictException('رقم الهاتف مستخدم من قبل طالب آخر');
    }

    // Check if CIN already exists
    const existingByCin = await this.studentsRepository.findOne({
      where: { cin: createStudentDto.cin }
    });
    if (existingByCin) {
      throw new ConflictException('رقم بطاقة التعريف مستخدم من قبل طالب آخر');
    }

    const student = this.studentsRepository.create({
      ...createStudentDto,
      licenseType: createStudentDto.licenseType || 'B'
    });
    
    return await this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    await this.lessonsService.autoCompleteLessons();
    return await this.studentsRepository.find({
      relations: ['lessons', 'payments'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Student> {
    await this.lessonsService.autoCompleteLessons(id);
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['lessons', 'payments']
    });
    
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }
    
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    
    // Check if phone number is being changed and if it conflicts
    if (updateStudentDto.phoneNumber && updateStudentDto.phoneNumber !== student.phoneNumber) {
      const existingByPhone = await this.studentsRepository.findOne({
        where: { phoneNumber: updateStudentDto.phoneNumber }
      });
      if (existingByPhone) {
        throw new ConflictException('رقم الهاتف مستخدم من قبل طالب آخر');
      }
    }

    // Check if CIN is being changed and if it conflicts
    if (updateStudentDto.cin && updateStudentDto.cin !== student.cin) {
      const existingByCin = await this.studentsRepository.findOne({
        where: { cin: updateStudentDto.cin }
      });
      if (existingByCin) {
        throw new ConflictException('رقم بطاقة التعريف مستخدم من قبل طالب آخر');
      }
    }

    Object.assign(student, updateStudentDto);
    return await this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);
  }

  async getStudentStats(id: number) {
    const student = await this.findOne(id);
    
    return {
      totalLessons: student.totalLessonsCompleted,
      totalPaid: student.totalAmountPaid,
      totalDue: student.totalAmountDue,
      lessonsRemaining: student.totalLessonsPaid - student.totalLessonsCompleted,
      status: student.status
    };
  }

  async searchStudents(query: string): Promise<Student[]> {
    return await this.studentsRepository
      .createQueryBuilder('student')
      .where('student.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('student.lastName LIKE :query', { query: `%${query}%` })
      .orWhere('student.phoneNumber LIKE :query', { query: `%${query}%` })
      .orWhere('student.cin LIKE :query', { query: `%${query}%` })
      .orderBy('student.createdAt', 'DESC')
      .getMany();
  }
}
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Student } from '../entities/student.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const paymentRepo = {
    createQueryBuilder: jest.fn(),
  };
  const studentRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    paymentRepo.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ lessonsCount: '3', amount: '30' }),
    });
    studentRepo.findOne.mockResolvedValue({
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      totalLessonsCompleted: 5,
      pricePerHour: 10,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
        { provide: getRepositoryToken(Student), useValue: studentRepo },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateStudentBalance', () => {
    it('should not return negative lessonsRemaining', async () => {
      const result = await service.calculateStudentBalance(1);
      expect(result.lessonsRemaining).toBe(0);
    });
  });
});

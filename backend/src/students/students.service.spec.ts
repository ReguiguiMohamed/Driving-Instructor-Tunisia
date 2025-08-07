import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { LessonsService } from '../lessons/lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: LessonsService, useValue: { autoCompleteLessons: jest.fn() } },
        { provide: getRepositoryToken(Student), useValue: {} },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentStats', () => {
    it('should not return negative lessonsRemaining', async () => {
      const mockStudent = {
        totalLessonsCompleted: 5,
        totalAmountPaid: 0,
        totalAmountDue: 0,
        totalLessonsPaid: 3,
        status: 'active',
      } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockStudent);
      const stats = await service.getStudentStats(1);
      expect(stats.lessonsRemaining).toBe(0);
    });
  });
});

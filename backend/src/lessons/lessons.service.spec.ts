import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from '../entities/lesson.entity';
import { Student } from '../entities/student.entity';

describe('LessonsService', () => {
  let service: LessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: getRepositoryToken(Lesson), useValue: {} },
        { provide: getRepositoryToken(Student), useValue: {} },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

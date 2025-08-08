import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { LessonsService } from '../lessons/lessons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: LessonsService, useValue: { findTodayLessons: jest.fn() } },
        { provide: getRepositoryToken(Notification), useValue: {} },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

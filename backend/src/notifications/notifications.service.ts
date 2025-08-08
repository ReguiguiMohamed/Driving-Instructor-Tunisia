import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/notifications/create-notification.dto';
import { UpdateNotificationDto } from '../dto/notifications/update-notification.dto';
import { LessonsService } from '../lessons/lessons.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private lessonsService: LessonsService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      scheduledDateTime: new Date(createNotificationDto.scheduledDateTime)
    });
    return await this.notificationsRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationsRepository.find({
      order: { scheduledDateTime: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }
    return notification;
  }

  async update(id: number, updateDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, {
      ...updateDto,
      scheduledDateTime: updateDto.scheduledDateTime
        ? new Date(updateDto.scheduledDateTime)
        : notification.scheduledDateTime
    });
    return await this.notificationsRepository.save(notification);
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationsRepository.remove(notification);
  }

  async generateTodayLessonNotifications(): Promise<void> {
    const lessons = await this.lessonsService.findTodayLessons();
    for (const lesson of lessons) {
      const exists = await this.notificationsRepository.findOne({ where: { lessonId: lesson.id } });
      if (!exists) {
        const notification = this.notificationsRepository.create({
          title: 'تذكير بالدرس',
          message: `لديك درس مع ${lesson.student?.name || ''} في ${lesson.scheduledDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          scheduledDateTime: lesson.scheduledDateTime,
          lessonId: lesson.id,
        });
        await this.notificationsRepository.save(notification);
      }
    }
  }

  async findPending(): Promise<Notification[]> {
    await this.generateTodayLessonNotifications();
    const now = new Date();
    return await this.notificationsRepository.find({
      where: { isSent: false, scheduledDateTime: LessThanOrEqual(now) },
      order: { scheduledDateTime: 'ASC' }
    });
  }

  async markAsSent(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isSent = true;
    return await this.notificationsRepository.save(notification);
  }
}

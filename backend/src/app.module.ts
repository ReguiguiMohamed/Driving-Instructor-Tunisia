import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { LessonsModule } from './lessons/lessons.module';
import { PaymentsModule } from './payments/payments.module';
import { SettingsModule } from './settings/settings.module';
import { Student } from './entities/student.entity';
import { Lesson } from './entities/lesson.entity';
import { Payment } from './entities/payment.entity';
import { Settings } from './entities/settings.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'fayrouz_driving.db',
      entities: [Student, Lesson, Payment, Settings, Notification],
      synchronize: true, // Only for development
      logging: false,
    }),
    StudentsModule,
    LessonsModule,
    PaymentsModule,
    SettingsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
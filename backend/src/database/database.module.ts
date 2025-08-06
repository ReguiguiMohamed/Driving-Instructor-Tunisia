import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Lesson } from '../entities/lesson.entity';
import { Payment } from '../entities/payment.entity';
import { Settings } from '../entities/settings.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'fayrouz_driving.db',
      entities: [Student, Lesson, Payment, Settings],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
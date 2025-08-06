import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from '../entities/student.entity';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), LessonsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // Export for use in other modules
})
export class StudentsModule {}
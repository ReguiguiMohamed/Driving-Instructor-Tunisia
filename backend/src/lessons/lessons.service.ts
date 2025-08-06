import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { Student } from '../entities/student.entity';
import { CreateLessonDto } from '../dto/lessons/create-lesson.dto';
import { UpdateLessonDto } from '../dto/lessons/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    // Verify student exists
    const student = await this.studentsRepository.findOne({
      where: { id: createLessonDto.studentId }
    });
    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    // Check if there's already a lesson at this time
    const existingLesson = await this.lessonsRepository.findOne({
      where: {
        scheduledDateTime: new Date(createLessonDto.scheduledDateTime),
        status: 'scheduled'
      }
    });
    if (existingLesson) {
      throw new BadRequestException('يوجد درس آخر في هذا الوقت');
    }

    const lesson = this.lessonsRepository.create({
      ...createLessonDto,
      scheduledDateTime: new Date(createLessonDto.scheduledDateTime),
      durationMinutes: createLessonDto.durationMinutes || 60,
      lessonType: createLessonDto.lessonType || 'practical',
      lessonPrice: createLessonDto.lessonPrice || 25.00
    });

    return await this.lessonsRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return await this.lessonsRepository.find({
      relations: ['student'],
      order: { scheduledDateTime: 'DESC' }
    });
  }

  async findByStudent(studentId: number): Promise<Lesson[]> {
    return await this.lessonsRepository.find({
      where: { studentId },
      relations: ['student'],
      order: { scheduledDateTime: 'DESC' }
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Lesson[]> {
    return await this.lessonsRepository.find({
      where: {
        scheduledDateTime: Between(new Date(startDate), new Date(endDate))
      },
      relations: ['student'],
      order: { scheduledDateTime: 'ASC' }
    });
  }

  async findTodayLessons(): Promise<Lesson[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.lessonsRepository.find({
      where: {
        scheduledDateTime: Between(startOfDay, endOfDay)
      },
      relations: ['student'],
      order: { scheduledDateTime: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['student']
    });
    
    if (!lesson) {
      throw new NotFoundException('الدرس غير موجود');
    }
    
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    
    // If changing scheduled time, check for conflicts
    if (updateLessonDto.scheduledDateTime) {
      const existingLesson = await this.lessonsRepository.findOne({
        where: {
          scheduledDateTime: new Date(updateLessonDto.scheduledDateTime),
          status: 'scheduled'
        }
      });
      if (existingLesson && existingLesson.id !== id) {
        throw new BadRequestException('يوجد درس آخر في هذا الوقت');
      }
    }

    // Update lesson data
    Object.assign(lesson, {
      ...updateLessonDto,
      scheduledDateTime: updateLessonDto.scheduledDateTime 
        ? new Date(updateLessonDto.scheduledDateTime) 
        : lesson.scheduledDateTime
    });

    const updatedLesson = await this.lessonsRepository.save(lesson);

    // If lesson is marked as completed, update student's lesson count
    if (updateLessonDto.status === 'completed' && lesson.status !== 'completed') {
      await this.updateStudentStats(lesson.studentId);
    }

    return updatedLesson;
  }

  async remove(id: number): Promise<void> {
    const lesson = await this.findOne(id);
    await this.lessonsRepository.remove(lesson);
  }

  async completeLesson(id: number, rating?: number, notes?: string, skillsAssessed?: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    
    lesson.status = 'completed';
    if (rating) lesson.rating = rating;
    if (notes) lesson.notes = notes;
    if (skillsAssessed) lesson.skillsAssessed = skillsAssessed;

    const updatedLesson = await this.lessonsRepository.save(lesson);
    await this.updateStudentStats(lesson.studentId);
    
    return updatedLesson;
  }

  private async updateStudentStats(studentId: number): Promise<void> {
    const student = await this.studentsRepository.findOne({ where: { id: studentId } });
    if (!student) return;

    const completedLessons = await this.lessonsRepository.count({
      where: { studentId, status: 'completed' }
    });

    const totalAmountDue = completedLessons * student.pricePerHour;

    await this.studentsRepository.update(studentId, {
      totalLessonsCompleted: completedLessons,
      totalAmountDue: totalAmountDue
    });
  }

  async getLessonStats() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const [todayLessons, totalLessons, completedLessons, scheduledLessons] = await Promise.all([
      this.lessonsRepository.count({
        where: { scheduledDateTime: Between(startOfDay, endOfDay) }
      }),
      this.lessonsRepository.count(),
      this.lessonsRepository.count({ where: { status: 'completed' } }),
      this.lessonsRepository.count({ where: { status: 'scheduled' } })
    ]);

    return {
      todayLessons,
      totalLessons,
      completedLessons,
      scheduledLessons
    };
  }

  async autoCompleteLessons(studentId?: number): Promise<void> {
    const now = new Date();
    const query = {
      scheduledDateTime: Between(new Date(0), now),
      status: 'scheduled'
    };

    if (studentId) {
      query['studentId'] = studentId;
    }

    const lessonsToComplete = await this.lessonsRepository.find({ where: query });

    if (lessonsToComplete.length > 0) {
      const studentIds = new Set<number>();
      for (const lesson of lessonsToComplete) {
        lesson.status = 'completed';
        studentIds.add(lesson.studentId);
      }
      await this.lessonsRepository.save(lessonsToComplete);

      for (const id of studentIds) {
        await this.updateStudentStats(id);
      }
    }
  }
}
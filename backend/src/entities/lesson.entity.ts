import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  studentId: number;

  @Column({ type: 'datetime' })
  scheduledDateTime: Date;

  @Column({ type: 'int', default: 60 })
  durationMinutes: number;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'scheduled' 
  })
  status: string; // scheduled, completed, cancelled, no_show

  @Column({ type: 'varchar', length: 50, default: 'practical' })
  lessonType: string; // theoretical, practical, exam_prep

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  skillsAssessed: string; // JSON string of skills checklist

  @Column({ type: 'int', nullable: true, default: null })
  rating: number; // 1-5 rating of student performance

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 25.00 })
  lessonPrice: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Student, student => student.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
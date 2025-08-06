import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Payment } from './payment.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 18, unique: true })
  cin: string; // Tunisian National ID

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ 
    type: 'varchar', 
    length: 10, 
    default: 'B' 
  })
  licenseType: string; // B, A, C, etc.

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 25 })
  pricePerHour: number;

  @Column({ type: 'int', default: 0 })
  totalLessonsCompleted: number;

  @Column({ type: 'int', default: 0 })
  totalLessonsPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmountPaid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmountDue: number;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'active' 
  })
  status: string; // active, completed, suspended

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lesson, lesson => lesson.student)
  lessons: Lesson[];

  @OneToMany(() => Payment, payment => payment.student)
  payments: Payment[];
}
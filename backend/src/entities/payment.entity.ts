import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  studentId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 20 })
  paymentMethod: string; // cash, card, bank_transfer

  @Column({ type: 'date' })
  paymentDate: string;

  @Column({ type: 'int', default: 0 })
  lessonsCount: number; // Number of lessons this payment covers

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  receiptNumber: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'completed' 
  })
  status: string; // pending, completed, refunded

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Student, student => student.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
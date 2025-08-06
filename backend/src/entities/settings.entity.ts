import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'varchar', length: 20, default: 'string' })
  type: string; // string, number, boolean, json

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Default settings that will be inserted
export const DEFAULT_SETTINGS = [
  {
    key: 'hourly_rate',
    value: '25.00',
    type: 'number',
    description: 'Default hourly rate for lessons in Tunisian Dinars'
  },
  {
    key: 'instructor_name',
    value: 'فيروز',
    type: 'string',
    description: 'Instructor name in Arabic'
  },
  {
    key: 'driving_school_name',
    value: 'مدرسة فيروز لتعليم السياقة',
    type: 'string',
    description: 'Driving school name in Arabic'
  },
  {
    key: 'working_hours_start',
    value: '08:00',
    type: 'string',
    description: 'Daily working hours start time'
  },
  {
    key: 'working_hours_end',
    value: '18:00',
    type: 'string',
    description: 'Daily working hours end time'
  },
  {
    key: 'currency_symbol',
    value: 'د.ت',
    type: 'string',
    description: 'Currency symbol for Tunisian Dinar'
  }
];
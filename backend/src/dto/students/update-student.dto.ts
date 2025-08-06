import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsNumber({}, { message: 'عدد الدروس المكتملة يجب أن يكون رقم' })
  @Min(0, { message: 'عدد الدروس المكتملة لا يمكن أن يكون سالب' })
  totalLessonsCompleted?: number;

  @IsOptional()
  @IsNumber({}, { message: 'عدد الدروس المدفوعة يجب أن يكون رقم' })
  @Min(0, { message: 'عدد الدروس المدفوعة لا يمكن أن يكون سالب' })
  totalLessonsPaid?: number;

  @IsOptional()
  @IsNumber({}, { message: 'المبلغ المدفوع يجب أن يكون رقم' })
  @Min(0, { message: 'المبلغ المدفوع لا يمكن أن يكون سالب' })
  totalAmountPaid?: number;

  @IsOptional()
  @IsNumber({}, { message: 'المبلغ المستحق يجب أن يكون رقم' })
  @Min(0, { message: 'المبلغ المستحق لا يمكن أن يكون سالب' })
  totalAmountDue?: number;

  @IsOptional()
  @IsString({ message: 'حالة الطالب يجب أن تكون نص' })
  @IsIn(['active', 'completed', 'suspended'], { 
    message: 'حالة الطالب يجب أن تكون: نشط، مكتمل، أو معلق' 
  })
  status?: string;

  @IsOptional()
  pricePerHour?: number;
}
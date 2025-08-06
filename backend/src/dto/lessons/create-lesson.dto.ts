import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString, IsIn, Min, Max, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLessonDto {
  @IsNotEmpty({ message: 'معرف الطالب مطلوب' })
  @IsNumber({}, { message: 'معرف الطالب يجب أن يكون رقم' })
  @IsPositive({ message: 'معرف الطالب يجب أن يكون رقم موجب' })
  studentId: number;

  @IsNotEmpty({ message: 'تاريخ ووقت الدرس مطلوب' })
  @IsDateString({}, { message: 'تاريخ ووقت الدرس غير صحيح' })
  scheduledDateTime: string;

  @IsOptional()
  @IsNumber({}, { message: 'مدة الدرس يجب أن تكون رقم' })
  @Min(30, { message: 'مدة الدرس لا يمكن أن تكون أقل من 30 دقيقة' })
  @Max(180, { message: 'مدة الدرس لا يمكن أن تكون أكثر من 180 دقيقة' })
  durationMinutes?: number;

  @IsOptional()
  @IsString({ message: 'نوع الدرس يجب أن يكون نص' })
  @IsIn(['theoretical', 'practical', 'exam_prep'], { 
    message: 'نوع الدرس يجب أن يكون: نظري، عملي، أو تحضير للامتحان' 
  })
  lessonType?: string;

  @IsOptional()
  @IsString({ message: 'الملاحظات يجب أن تكون نص' })
  notes?: string;

  @IsOptional()
  @IsNumber({}, { message: 'سعر الدرس يجب أن يكون رقم' })
  @Min(0, { message: 'سعر الدرس لا يمكن أن يكون سالب' })
  @Transform(({ value }) => parseFloat(value))
  lessonPrice?: number;
}
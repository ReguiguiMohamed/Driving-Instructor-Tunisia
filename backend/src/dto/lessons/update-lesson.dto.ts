import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsOptional, IsString, IsIn, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
  @IsOptional()
  @IsString({ message: 'حالة الدرس يجب أن تكون نص' })
  @IsIn(['scheduled', 'completed', 'cancelled', 'no_show'], { 
    message: 'حالة الدرس يجب أن تكون: مجدول، مكتمل، ملغي، أو غياب' 
  })
  status?: string;

  @IsOptional()
  @IsString({ message: 'المهارات المقيمة يجب أن تكون نص' })
  skillsAssessed?: string;

  @IsOptional()
  @IsNumber({}, { message: 'التقييم يجب أن يكون رقم' })
  @Min(1, { message: 'التقييم يجب أن يكون على الأقل 1' })
  @Max(5, { message: 'التقييم يجب أن يكون على الأكثر 5' })
  rating?: number;

  @IsOptional()
  @IsBoolean({ message: 'حالة الدفع يجب أن تكون صحيح أو خطأ' })
  isPaid?: boolean;
}
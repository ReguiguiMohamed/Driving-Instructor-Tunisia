import { IsNotEmpty, IsString, IsDateString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: 'عنوان الإشعار مطلوب' })
  @IsString({ message: 'عنوان الإشعار يجب أن يكون نص' })
  title: string;

  @IsNotEmpty({ message: 'محتوى الإشعار مطلوب' })
  @IsString({ message: 'محتوى الإشعار يجب أن يكون نص' })
  message: string;

  @IsNotEmpty({ message: 'تاريخ ووقت الإشعار مطلوب' })
  @IsDateString({}, { message: 'تاريخ ووقت الإشعار غير صحيح' })
  scheduledDateTime: string;

  @IsOptional()
  @IsNumber({}, { message: 'معرف الدرس يجب أن يكون رقم' })
  lessonId?: number;

  @IsOptional()
  @IsBoolean({ message: 'حالة الإرسال يجب أن تكون صحيح أو خطأ' })
  isSent?: boolean;
}

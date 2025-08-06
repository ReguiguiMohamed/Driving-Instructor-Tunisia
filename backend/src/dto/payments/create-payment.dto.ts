import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn, Min, IsPositive, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'معرف الطالب مطلوب' })
  @IsNumber({}, { message: 'معرف الطالب يجب أن يكون رقم' })
  @IsPositive({ message: 'معرف الطالب يجب أن يكون رقم موجب' })
  studentId: number;

  @IsNotEmpty({ message: 'المبلغ مطلوب' })
  @IsNumber({}, { message: 'المبلغ يجب أن يكون رقم' })
  @Min(0.01, { message: 'المبلغ يجب أن يكون أكبر من صفر' })
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsNotEmpty({ message: 'طريقة الدفع مطلوبة' })
  @IsString({ message: 'طريقة الدفع يجب أن تكون نص' })
  @IsIn(['cash', 'card', 'bank_transfer'], { 
    message: 'طريقة الدفع يجب أن تكون: نقدي، بطاقة، أو تحويل بنكي' 
  })
  paymentMethod: string;

  @IsNotEmpty({ message: 'تاريخ الدفع مطلوب' })
  @IsDateString({}, { message: 'تاريخ الدفع غير صحيح' })
  paymentDate: string;

  @IsOptional()
  @IsNumber({}, { message: 'عدد الدروس يجب أن يكون رقم' })
  @Min(0, { message: 'عدد الدروس لا يمكن أن يكون سالب' })
  lessonsCount?: number;

  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نص' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'رقم الإيصال يجب أن يكون نص' })
  receiptNumber?: string;
}
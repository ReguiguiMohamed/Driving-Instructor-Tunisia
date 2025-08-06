import { IsString, IsNotEmpty, IsOptional, IsDateString, Length, Matches, IsIn } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  @IsString({ message: 'الاسم الأول يجب أن يكون نص' })
  @Length(2, 100, { message: 'الاسم الأول يجب أن يكون بين 2 و 100 حرف' })
  firstName: string;

  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  @IsString({ message: 'اسم العائلة يجب أن يكون نص' })
  @Length(2, 100, { message: 'اسم العائلة يجب أن يكون بين 2 و 100 حرف' })
  lastName: string;

  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  @IsString({ message: 'رقم الهاتف يجب أن يكون نص' })
  @Matches(/^[0-9]{8}$/, { message: 'رقم الهاتف يجب أن يكون 8 أرقام' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'رقم بطاقة التعريف مطلوب' })
  @IsString({ message: 'رقم بطاقة التعريف يجب أن يكون نص' })
  @Length(8, 8, { message: 'رقم بطاقة التعريف يجب أن يكون 8 أرقام' })
  @Matches(/^[0-9]{8}$/, { message: 'رقم بطاقة التعريف يجب أن يحتوي على أرقام فقط' })
  cin: string;

  @IsNotEmpty({ message: 'تاريخ الميلاد مطلوب' })
  @IsDateString({}, { message: 'تاريخ الميلاد غير صحيح' })
  dateOfBirth: string;

  @IsOptional()
  @IsString({ message: 'العنوان يجب أن يكون نص' })
  @Length(0, 200, { message: 'العنوان لا يجب أن يتجاوز 200 حرف' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'نوع الرخصة يجب أن يكون نص' })
  @IsIn(['A', 'B', 'C', 'D'], { message: 'نوع الرخصة يجب أن يكون A أو B أو C أو D' })
  licenseType?: string;

  @IsOptional()
  @IsString({ message: 'الملاحظات يجب أن تكون نص' })
  notes?: string;

  @IsOptional()
  pricePerHour?: number;
}
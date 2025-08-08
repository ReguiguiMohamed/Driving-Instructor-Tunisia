
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cin: string;
  dateOfBirth: string;
  address: string;
  licenseType: string;
  totalLessonsCompleted: number;
  totalLessonsPaid: number;
  totalAmountPaid: number;
  totalAmountDue: number;
  status: string;
  notes: string;
  pricePerHour: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: number;
  studentId: number;
  scheduledDateTime: Date;
  durationMinutes: number;
  status: string;
  lessonType: string;
  notes: string;
  skillsAssessed: string;
  rating: number;
  lessonPrice: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  lessonsCount: number;
  description: string;
  receiptNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  scheduledDateTime: Date;
  isSent: boolean;
  lessonId?: number;
  createdAt: Date;
  updatedAt: Date;
}

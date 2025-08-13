import { getStudents } from './studentService';
import { getLessons } from './lessonService';
import { getPayments } from './paymentService';
import { getNotifications, createNotification } from './notificationService';
import { Student, Lesson, Notification } from '../types';

const showBrowserNotification = (title: string, message: string) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
};

export const generateReminders = async (): Promise<void> => {
  const [students, lessons, payments, existing] = await Promise.all([
    getStudents(),
    getLessons(),
    getPayments(),
    getNotifications(),
  ]);

  const notifications = [...existing];
  const exists = (title: string, message: string) =>
    notifications.some(n => n.title === title && n.message === message);

  const now = new Date();

  // Payment reminders
  students.forEach((student: Student) => {
    const studentLessons = lessons.filter(
      (l: Lesson) => l.studentId === student.id && new Date(l.scheduledDateTime) <= now
    );
    const totalPayments = payments
      .filter(p => p.studentId === student.id)
      .reduce((sum, p) => sum + p.amount, 0);
    const balance = studentLessons.length * student.pricePerHour - totalPayments;
    if (balance > 0) {
      const title = 'تنبيه دفع';
      const message = `الطالب ${student.firstName} ${student.lastName} لديه دروس غير مدفوعة`;
      if (!exists(title, message)) {
        createNotification({ title, message, scheduledDateTime: now.toISOString(), isSent: false });
        showBrowserNotification(title, message);
        notifications.push({ id: 0, title, message, scheduledDateTime: now.toISOString(), isSent: false, createdAt: '', updatedAt: '' } as Notification);
      }
    }
  });

  // Lesson reminders for today
  lessons.forEach((lesson: Lesson) => {
    const lessonDate = new Date(lesson.scheduledDateTime);
    if (lesson.status !== 'completed' && lessonDate.toDateString() === now.toDateString()) {
      const student = students.find(s => s.id === lesson.studentId);
      const title = 'تذكير درس';
      const time = lessonDate.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' });
      const message = `درس مع ${student?.firstName} ${student?.lastName} اليوم في ${time}`;
      if (!exists(title, message)) {
        createNotification({ title, message, scheduledDateTime: lesson.scheduledDateTime, isSent: false, lessonId: lesson.id });
        showBrowserNotification(title, message);
        notifications.push({ id: 0, title, message, scheduledDateTime: lesson.scheduledDateTime, isSent: false, createdAt: '', updatedAt: '' } as Notification);
      }
    }
  });

  // Exam reminders
  students.forEach((student: Student) => {
    if (student.conduiteExamDate) {
      const examDate = new Date(student.conduiteExamDate);
      if (examDate.toDateString() === now.toDateString()) {
        const title = 'تذكير امتحان';
        const message = `امتحان السياقة لـ ${student.firstName} ${student.lastName} اليوم`;
        if (!exists(title, message)) {
          createNotification({ title, message, scheduledDateTime: examDate.toISOString(), isSent: false });
          showBrowserNotification(title, message);
          notifications.push({ id: 0, title, message, scheduledDateTime: examDate.toISOString(), isSent: false, createdAt: '', updatedAt: '' } as Notification);
        }
      }
    }
    if (student.parkExamDate) {
      const examDate = new Date(student.parkExamDate);
      if (examDate.toDateString() === now.toDateString()) {
        const title = 'تذكير امتحان';
        const message = `امتحان البارك لـ ${student.firstName} ${student.lastName} اليوم`;
        if (!exists(title, message)) {
          createNotification({ title, message, scheduledDateTime: examDate.toISOString(), isSent: false });
          showBrowserNotification(title, message);
          notifications.push({ id: 0, title, message, scheduledDateTime: examDate.toISOString(), isSent: false, createdAt: '', updatedAt: '' } as Notification);
        }
      }
    }
  });
};

export default generateReminders;

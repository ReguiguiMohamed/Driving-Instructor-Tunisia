import React, { useEffect, useState } from 'react';
import { Lesson, Student } from '../../types';
import { getLessons, createLesson, updateLesson, deleteLesson } from '../../services/lessonService';
import { getStudents } from '../../services/studentService';
import LessonForm from './LessonForm';
import Loading from '../common/Loading';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const LessonCalendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [dialogTitle, setDialogTitle] = useState('إضافة درس جديد');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [lessonData, studentData] = await Promise.all([getLessons(), getStudents()]);
        setLessons(lessonData);
        setStudents(studentData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleOpen = (lesson?: Lesson) => {
    if (lesson) {
      setSelectedLesson(lesson);
      setDialogTitle('تعديل الدرس');
    } else {
      setSelectedLesson(null);
      setDialogTitle('إضافة درس جديد');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLesson(null);
  };

  const handleCreateLesson = async (
    lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newLesson = await createLesson(lesson);
    setLessons(prev => [...prev, newLesson]);
    handleClose();
  };

  const handleUpdateLesson = async (
    lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!selectedLesson) return;
    const updatedLesson = await updateLesson(selectedLesson.id, lesson);
    setLessons(prev => prev.map(l => (l.id === selectedLesson.id ? updatedLesson : l)));
    handleClose();
  };

  const handleDeleteLesson = async (id: number) => {
    await deleteLesson(id);
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        bgcolor: 'background.default',
        minHeight: '100vh',
        position: 'relative',
      }}
      className="fade-in"
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}
      >
        الجدول الزمني للدروس
      </Typography>

      <Grid container spacing={2}>
        {lessons.map(lesson => (
          // FIXED: Changed 'item' and 'xs' props to the 'size' prop.
          <Grid size={{ xs: 12 }} key={lesson.id}>
            <Card sx={{ backdropFilter: 'blur(16px)', background: 'rgba(55, 57, 55, 1)', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  الطالب: {students.find(s => s.id === lesson.studentId)?.firstName} {' '}
                  {students.find(s => s.id === lesson.studentId)?.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {new Date(lesson.scheduledDateTime).toLocaleDateString('ar-TN')} {' '}
                  {new Date(lesson.scheduledDateTime).toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  المدة: {lesson.durationMinutes} دقيقة
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => handleOpen(lesson)}>تعديل</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteLesson(lesson.id)}>حذف</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 40,
          right: isMobile ? 16 : 24,
          zIndex: 1000,
        }}
        size={isMobile ? 'medium' : 'large'}
      >
        <Add />
      </Fab>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <LessonForm 
            students={students} 
            onSubmit={selectedLesson ? handleUpdateLesson : handleCreateLesson} 
            initialData={selectedLesson}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LessonCalendar;
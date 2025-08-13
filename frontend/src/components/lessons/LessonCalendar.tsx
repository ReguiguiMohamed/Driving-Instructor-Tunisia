import React, { useEffect, useState } from 'react';
import { Lesson, Student } from '../../types';
import { getLessons, createLesson, updateLesson, deleteLesson } from '../../services/lessonService';
import { getStudents } from '../../services/studentService';
import LessonForm from './LessonForm';
import Loading from '../common/Loading';
import LessonCard from './LessonCard';
import useOfflineStorage from '../../hooks/useOfflineStorage';
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
  Button,
  Fab,
} from '@mui/material';
import AddHint from '../common/AddHint';
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
  const {
    getData: getLessonsData,
    isOnline: lessonsOnline,
    syncData: syncLessons,
  } = useOfflineStorage<Lesson[]>('lessons', getLessons);
  const {
    getData: getStudentsData,
    isOnline: studentsOnline,
    syncData: syncStudents,
  } = useOfflineStorage<Student[]>('students', getStudents);

  useEffect(() => {
    (async () => {
      try {
        const [lessonData, studentData] = await Promise.all([
          getLessonsData(),
          getStudentsData(),
        ]);
        setLessons(lessonData);
        setStudents(studentData);
      } finally {
        setLoading(false);
      }
    })();
  }, [getLessonsData, getStudentsData]);

  useEffect(() => {
    syncLessons();
    syncStudents();
  }, [lessonsOnline, studentsOnline, syncLessons, syncStudents]);

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

  const handleMarkDone = async (id: number) => {
    const updatedLesson = await updateLesson(id, { status: 'completed' });
    setLessons(prev => prev.map(l => (l.id === id ? updatedLesson : l)));
  };

  if (loading) {
    return <Loading />;
  }

  const todayLessons = lessons.filter(l => {
    const d = new Date(l.scheduledDateTime);
    const now = new Date();
    return d.toDateString() === now.toDateString() && l.status !== 'completed';
  });

  return (
    <Box sx={{ p: isMobile ? 2 : 3, bgcolor: 'background.default' }} className="fade-in">
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}
      >
        الجدول الزمني للدروس
      </Typography>

      {todayLessons.length > 0 && (
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 600, color: 'warning.main', textAlign: 'center' }}
        >
          لديك {todayLessons.length} دروس اليوم
        </Typography>
      )}

      <Grid container spacing={3}>
        {lessons.map(lesson => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson.id}>
            <LessonCard
              lesson={lesson}
              student={students.find(s => s.id === lesson.studentId)}
              onEdit={() => handleOpen(lesson)}
              onDelete={handleDeleteLesson}
              onMarkDone={handleMarkDone}
            />
          </Grid>
        ))}
      </Grid>

      <AddHint
        message="اضغط للإضافة"
        sx={{
          bottom: { xs: 'calc(160px + env(safe-area-inset-bottom))', sm: 96 },
          right: { xs: 16, sm: 32 },
        }}
      />

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpen()}
        sx={{
          position: 'fixed',
          bottom: { xs: 'calc(96px + env(safe-area-inset-bottom))', sm: 32 },
          right: { xs: 16, sm: 32 },
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
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
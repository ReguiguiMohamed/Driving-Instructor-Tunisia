import React, { useState } from 'react';
import { Lesson, Student } from '../../types';
import {
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as ClockIcon,
  CalendarToday as CalendarIcon,
  Note as NoteIcon,
} from '@mui/icons-material';

interface Props {
  students: Student[];
  onSubmit: (lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Lesson | null;
}

const LessonForm: React.FC<Props> = ({ students, onSubmit, initialData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [studentId, setStudentId] = useState<number | ''>(initialData?.studentId || '');
  const [scheduledDateTime, setScheduledDateTime] = useState(
    initialData?.scheduledDateTime
      ? new Date(initialData.scheduledDateTime).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 60);
  const [lessonType, setLessonType] = useState(initialData?.lessonType || 'practical');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentId: Number(studentId),
      scheduledDateTime,
      durationMinutes,
      status: 'scheduled',
      lessonType,
      notes,
      skillsAssessed: '',
      rating: 0,
      lessonPrice: 25,
      isPaid: false,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: isMobile ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="student-label">الطالب</InputLabel>
        <Select
          labelId="student-label"
          value={studentId}
          label="الطالب"
          onChange={e => setStudentId(e.target.value as number)}
          required
          startAdornment={<InputAdornment position="start"><PersonIcon /></InputAdornment>}
        >
          <MenuItem value="">اختر طالبًا</MenuItem>
          {students.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="تاريخ ووقت الدرس"
            type="datetime-local"
            fullWidth
            value={scheduledDateTime}
            onChange={e => setScheduledDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="المدة (دقيقة)"
            type="number"
            fullWidth
            value={durationMinutes}
            onChange={e => setDurationMinutes(Number(e.target.value))}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ClockIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <FormControl fullWidth>
        <InputLabel id="type-label">نوع الدرس</InputLabel>
        <Select
          labelId="type-label"
          value={lessonType}
          label="نوع الدرس"
          onChange={e => setLessonType(e.target.value)}
        >
          <MenuItem value="practical">عملي</MenuItem>
          <MenuItem value="park">بارك</MenuItem>
          <MenuItem value="exam_prep">تحضير للاختبار</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="ملاحظات"
        multiline
        rows={3}
        fullWidth
        value={notes}
        onChange={e => setNotes(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NoteIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" fullWidth size="large">
        حفظ الدرس
      </Button>
    </Box>
  );
};

export default LessonForm;

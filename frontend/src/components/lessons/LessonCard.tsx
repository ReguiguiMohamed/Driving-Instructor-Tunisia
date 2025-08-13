import React, { useState } from 'react';
import { Lesson, Student } from '../../types';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete as DeleteIcon,
  Check,
} from '@mui/icons-material';

interface LessonCardProps {
  lesson: Lesson;
  student?: Student;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: number) => void;
  onMarkDone: (id: number) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, student, onEdit, onDelete, onMarkDone }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);

  const scheduledDate = new Date(lesson.scheduledDateTime);
  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
  const isToday = isSameDay(scheduledDate, new Date()) && lesson.status !== 'completed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#16A34A';
      case 'scheduled':
        return '#1E293B';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  return (
    <Card
      sx={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.2)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isToday
            ? `linear-gradient(90deg, #F59E0B, #F59E0BCC)`
            : `linear-gradient(90deg, ${getStatusColor(lesson.status)}, ${getStatusColor(lesson.status)}CC)`,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {student?.firstName} {student?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {scheduledDate.toLocaleDateString('ar-TN')} {' '}
              {scheduledDate.toLocaleTimeString('ar-TN', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
          {isToday && (
            <Chip label="درس اليوم" color="warning" size="small" sx={{ fontWeight: 600, mr: 1 }} />
          )}
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: '#1E293B' }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            المدة: {lesson.durationMinutes} دقيقة
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            النوع: {lesson.lessonType}
          </Typography>
          {lesson.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              ملاحظات: {lesson.notes}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {lesson.status !== 'completed' && (
              <Button size="small" color="success" onClick={() => onMarkDone(lesson.id)} startIcon={<Check fontSize="small" />}>
                تم
              </Button>
            )}
            <Button size="small" onClick={() => onEdit(lesson)} startIcon={<Edit fontSize="small" />}> 
              تعديل
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(lesson.id)}
              startIcon={<DeleteIcon fontSize="small" />}
            >
              حذف
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default LessonCard;

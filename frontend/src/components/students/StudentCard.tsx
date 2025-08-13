import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit,
  Delete as DeleteIcon,
  ExpandMore,
  ExpandLess,
  Phone,
  Person,
  Schedule,
} from '@mui/icons-material';
import { Student, Lesson, Payment } from '../../types';
import { formatCurrency } from '../../utils/currency';
import EventIcon from '@mui/icons-material/Event';

interface StudentCardProps {
  student: Student;
  lessons: Lesson[];
  payments: Payment[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, lessons, payments, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);

  const isConduiteExamToday =
    student.conduiteExamDate &&
    new Date(student.conduiteExamDate).toDateString() === new Date().toDateString();

  const isParkExamToday =
    student.parkExamDate &&
    new Date(student.parkExamDate).toDateString() === new Date().toDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#1E293B'; // Slate-800
      case 'completed': return '#16A34A'; // Green-600
      case 'suspended': return '#DC2626'; // Red-600
      default: return '#6B7280'; // Gray-500
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  const lessonPrice = 25;

  const completedLessonsCount = lessons.filter(
    l => l.studentId === student.id && new Date(l.scheduledDateTime) <= new Date()
  ).length;
  const totalPayments = payments
    .filter(p => p.studentId === student.id)
    .reduce((sum, p) => sum + p.amount, 0);
  const paidLessonsCount = Math.floor(totalPayments / lessonPrice);
  const balanceAmount = completedLessonsCount * lessonPrice - totalPayments;

  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: (isConduiteExamToday || isParkExamToday)
          ? '2px solid #F59E0B'
          : '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${getStatusColor(student.status)}, ${getStatusColor(student.status)}CC)`,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${getStatusColor(student.status)}20, ${getStatusColor(student.status)}10)`,
              color: getStatusColor(student.status),
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
            }}
          >
            {student.firstName.charAt(0)}
          </Avatar>
          <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {student.firstName} {student.lastName}
            </Typography>
            <Chip
              label={getStatusLabel(student.status)}
              size="small"
              sx={{ mt: 1, background: `${getStatusColor(student.status)}15`, color: getStatusColor(student.status), fontWeight: 600 }}
            />
            {isConduiteExamToday && (
              <Chip label="امتحان سياقة اليوم" color="warning" size="small" sx={{ mt: 1, fontWeight: 600 }} />
            )}
            {isParkExamToday && (
              <Chip label="امتحان بارك اليوم" color="warning" size="small" sx={{ mt: 1, fontWeight: 600 }} />
            )}
          </Box>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: '#1E293B' }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {[
              { label: 'دروس مكتملة', value: completedLessonsCount, color: '#1E293B' },
              { label: 'دروس مدفوعة', value: paidLessonsCount, color: '#16A34A' },
              { label: 'المدفوعات', value: formatCurrency(totalPayments), color: '#334155' },
              { label: 'المتبقي', value: formatCurrency(balanceAmount), color: balanceAmount > 0 ? '#F59E0B' : '#6B7280' },
            ].map((stat, idx) => (
              <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 1, p: 2, background: 'rgba(241,245,249,0.8)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#1F2937' }}>
              <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {student.phoneNumber}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#1F2937' }}>
              <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {student.cin}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1F2937' }}>
              <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {new Date(student.dateOfBirth).toLocaleDateString('ar-TN')}
            </Typography>
            {student.conduiteExamDate && (
              <Typography variant="body2" sx={{ color: isConduiteExamToday ? 'warning.main' : '#1F2937', mt: 1 }}>
                <EventIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> امتحان سياقة: {new Date(student.conduiteExamDate).toLocaleDateString('ar-TN')}
              </Typography>
            )}
            {student.parkExamDate && (
              <Typography variant="body2" sx={{ color: isParkExamToday ? 'warning.main' : '#1F2937', mt: 0.5 }}>
                <EventIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> امتحان بارك: {new Date(student.parkExamDate).toLocaleDateString('ar-TN')}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button size="small" onClick={() => onEdit(student)} startIcon={<Edit fontSize="small" />}>
              تعديل
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(student.id)}
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

export default StudentCard;
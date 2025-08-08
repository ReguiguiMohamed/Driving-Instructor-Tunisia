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
import { Student } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#2563EB'; // Blue-600
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

  const completedLessonsCount = student.totalLessonsCompleted;
  const pricePerHour = student.pricePerHour;
  const paidLessonsCount = Math.floor(student.totalAmountPaid / pricePerHour);
  const remainingLessonsCount = completedLessonsCount - paidLessonsCount;
  const balanceAmount = completedLessonsCount * pricePerHour - student.totalAmountPaid;

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
              sx={{ fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {student.firstName} {student.lastName}
            </Typography>
            <Chip
              label={getStatusLabel(student.status)}
              size="small"
              sx={{ mt: 1, background: `${getStatusColor(student.status)}15`, color: getStatusColor(student.status), fontWeight: 600 }}
            />
          </Box>
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ color: '#2563EB' }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {[
              { label: 'دروس مكتملة', value: completedLessonsCount, color: '#2563EB' },
              { label: 'دروس مدفوعة', value: paidLessonsCount, color: '#16A34A' },
              { label: balanceAmount > 0 ? 'مستحق' : 'مدفوع', value: formatCurrency(Math.abs(balanceAmount)), color: balanceAmount > 0 ? '#DC2626' : '#16A34A' },
              { label: 'متبقية', value: remainingLessonsCount, color: remainingLessonsCount > 0 ? '#F59E0B' : '#6B7280' },
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
          <Box sx={{ mt: 1, p: 2, background: 'rgba(248,250,252,0.6)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {student.phoneNumber}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {student.cin}
            </Typography>
            <Typography variant="body2">
              <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> {new Date(student.dateOfBirth).toLocaleDateString('ar-TN')}
            </Typography>
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
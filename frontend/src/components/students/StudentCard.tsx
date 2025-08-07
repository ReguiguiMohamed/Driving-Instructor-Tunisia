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

  // Calculate counts and balances
  const completedLessonsCount = student.totalLessonsCompleted;
  const pricePerHour = student.pricePerHour;
  const paidLessonsCount = Math.floor(student.totalAmountPaid / pricePerHour);
  const remainingLessonsCount = completedLessonsCount - paidLessonsCount;
  const balanceAmount = completedLessonsCount * pricePerHour - student.totalAmountPaid;

  // Stats array
  const stats = [
    {
      label: 'دروس مكتملة',
      value: completedLessonsCount,
      isCurrency: false as const,
      color: '#2563EB', // Blue-600
    },
    {
      label: 'دروس مدفوعة',
      value: paidLessonsCount,
      isCurrency: false as const,
      color: '#16A34A', // Green-600
    },
    {
      label: balanceAmount > 0 ? 'مستحق' : 'مدفوع',
      value: Math.abs(balanceAmount),
      isCurrency: true as const,
      color: balanceAmount > 0 ? '#DC2626' : '#16A34A', // Red-600 or Green-600
    },
    {
      label: 'متبقية',
      value: remainingLessonsCount,
      isCurrency: false as const,
      color: remainingLessonsCount > 0 ? '#F59E0B' : '#6B7280', // Amber-500 or Gray-500
    },
  ];

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
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
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          </Box>
          <Box>
            <IconButton onClick={() => onEdit(student)} size="small" sx={{ mr: 1, color: '#2563EB' }}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton onClick={() => setExpanded(!expanded)} size="small" sx={{ color: '#16A34A' }}>
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {stats.map((stat, idx) => (
            <Grid key={idx} size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.isCurrency ? formatCurrency(stat.value) : stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
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
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Button
                size="small"
                onClick={() => onDelete(student.id)}
                sx={{ color: '#EF4444' }}
                startIcon={<DeleteIcon fontSize="small" />}
              >
                حذف
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default StudentCard;

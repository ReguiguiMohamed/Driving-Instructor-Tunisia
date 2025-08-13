import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Student } from '../../types';

interface Props {
  student?: Student;
  onSubmit: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const StudentForm: React.FC<Props> = ({ student, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [firstName, setFirstName] = useState(student?.firstName || '');
  const [lastName, setLastName] = useState(student?.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(student?.phoneNumber || '');
  const [cin, setCin] = useState(student?.cin || '');
  const [dateOfBirth, setDateOfBirth] = useState(student?.dateOfBirth || '');
  const [address, setAddress] = useState(student?.address || '');
  const [pricePerHour, setPricePerHour] = useState(student?.pricePerHour || 25);
  const [conduiteExamDate, setConduiteExamDate] = useState(student?.conduiteExamDate || '');
  const [parkExamDate, setParkExamDate] = useState(student?.parkExamDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      phoneNumber,
      cin,
      dateOfBirth,
      address,
      licenseType: student?.licenseType || 'B',
      totalLessonsCompleted: student?.totalLessonsCompleted || 0,
      totalLessonsPaid: student?.totalLessonsPaid || 0,
      totalAmountPaid: student?.totalAmountPaid || 0,
      totalAmountDue: student?.totalAmountDue || 0,
      status: student?.status || 'active',
      notes: student?.notes || '',
      pricePerHour: pricePerHour,
      conduiteExamDate,
      parkExamDate,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        p: isMobile ? 2 : 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="الاسم"
            fullWidth
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="اسم العائلة"
            fullWidth
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="الهاتف"
            fullWidth
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="CIN"
            fullWidth
            value={cin}
            onChange={e => setCin(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="تاريخ الميلاد"
            type="date"
            fullWidth
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
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
            label="العنوان"
            fullWidth
            value={address}
            onChange={e => setAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="سعر الساعة"
            type="number"
            fullWidth
            value={pricePerHour}
            onChange={e => setPricePerHour(Number(e.target.value))}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="تاريخ امتحان السياقة"
            type="date"
            fullWidth
            value={conduiteExamDate}
            onChange={e => setConduiteExamDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
            label="تاريخ امتحان البارك"
            type="date"
            fullWidth
            value={parkExamDate}
            onChange={e => setParkExamDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 1, fontWeight: 600 }}
      >
        حفظ
      </Button>
    </Box>
  );
};

export default StudentForm;

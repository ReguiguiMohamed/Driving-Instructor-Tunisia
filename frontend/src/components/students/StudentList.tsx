import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  InputAdornment,
  Fab,
  Collapse,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  Search,
  Phone,
  Person,
  Schedule,
} from '@mui/icons-material';
import { Student } from '../../types';
import { getStudents, createStudent, deleteStudent, updateStudent } from '../../services/studentService';
import StudentCard from './StudentCard';
import Loading from '../common/Loading';
import useOfflineStorage from '../../hooks/useOfflineStorage';

const StudentList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    cin: '',
    dateOfBirth: '',
    licenseType: '',
  });

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOnline, getData, syncData } = useOfflineStorage<Student[]>(
    'students',
    getStudents
  );

  useEffect(() => {
    (async () => {
      try {
        const list = await getData();
        setStudents(list);
        setFiltered(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getData]);

  useEffect(() => {
    syncData();
  }, [isOnline, syncData]);

  // filter as user types
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      students.filter(s =>
        (`${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
         s.phoneNumber.includes(term) ||
         s.cin.includes(term))
      )
    );
  }, [searchTerm, students]);

  const [dialogTitle, setDialogTitle] = useState('إضافة طالب جديد');

  const handleOpen = (student?: Student) => {
    if (student && student.id) {
      setForm(student);
      setDialogTitle('تعديل بيانات الطالب');
    } else {
      setForm({ firstName: '', lastName: '', phoneNumber: '', cin: '', dateOfBirth: '', licenseType: '' });
      setDialogTitle('إضافة طالب جديد');
    }
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
    setForm({ firstName: '', lastName: '', phoneNumber: '', cin: '', dateOfBirth: '', licenseType: '' });
    setAlert(null);
  };

  const handleChange = (key: keyof Partial<Student>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const handleAdd = async () => {
    try {
      const created = await createStudent(form as Student);
      setStudents(s => [created, ...s]);
      setAlert({ type: 'success', message: 'تمت إضافة الطالب بنجاح' });
      // Close the dialog after successful creation
      handleClose(); 
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'فشل إضافة الطالب، حاول مرة أخرى' });
    }
  };

  const handleEdit = (student: Student) => {
    handleOpen(student);
  };

  const handleUpdate = async () => {
    if (!form.id) return;

    try {
      const updated = await updateStudent(form.id, form as Student);
      setStudents(s => s.map(x => (x.id === form.id ? updated : x)));
      setAlert({ type: 'success', message: 'تم تحديث الطالب بنجاح' });
      handleClose();
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'فشل تحديث الطالب، حاول مرة أخرى' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      setStudents(s => s.filter(x => x.id !== id));
      setAlert({ type: 'success', message: 'تم حذف الطالب' });
    } catch {
      setAlert({ type: 'error', message: 'فشل حذف الطالب' });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3, pb: 10 /* Add padding to bottom to avoid overlap with FAB */ }} className="fade-in">
      {/* Header & Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ flexGrow: 1 }}>
          إدارة الطلاب
        </Typography>
        <TextField
          size="small"
          placeholder="ابحث عن طالب"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Alerts */}
      <Collapse in={!!alert} sx={{ mb: 2 }}>
        {alert && <Alert severity={alert.type} onClose={() => setAlert(null)}>{alert.message}</Alert>}
      </Collapse>

      {/* Student Cards */}
      <Grid container spacing={3}>
        {filtered.map(student => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={student.id}>
            <StudentCard
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {/* FIXED: Add Student FAB at the bottom right */}
      <Fab
        color="primary"
        onClick={() => handleOpen()}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
        }}
        size={isMobile ? 'medium' : 'large'}
      >
        <Add />
      </Fab>

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="الاسم"
                fullWidth
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="اسم العائلة"
                fullWidth
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="الهاتف"
                fullWidth
                value={form.phoneNumber}
                onChange={handleChange('phoneNumber')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="CIN"
                fullWidth
                value={form.cin}
                onChange={handleChange('cin')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
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
                value={form.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                // FIXED: Removed deprecated InputLabelProps. The 'type="date"' prop handles the label shrink automatically.
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="نوع الرخصة"
                fullWidth
                value={form.licenseType}
                onChange={handleChange('licenseType')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button variant="contained" onClick={form.id ? handleUpdate : handleAdd}>
            {form.id ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentList;

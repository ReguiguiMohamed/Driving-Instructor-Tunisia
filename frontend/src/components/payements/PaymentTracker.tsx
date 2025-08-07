import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fab,
  IconButton,
  Collapse,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Receipt,
  CreditCard,
  AccountBalance,
  Paid,
  Event,
  Description,
  ConfirmationNumber,
} from '@mui/icons-material';
import { Payment, Student } from '../../types';
import { getPayments, createPayment, updatePayment, deletePayment } from '../../services/paymentService';
import { getStudents } from '../../services/studentService';
import { formatCurrency } from '../../utils/currency';

// Component to render a single payment card
const PaymentCard: React.FC<{ payment: Payment; student?: Student; onEdit: () => void; onDelete: () => void; }> = ({ payment, student, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard />;
      case 'bank_transfer': return <AccountBalance />;
      default: return <Paid />;
    }
  };

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ background: `linear-gradient(135deg, #2563EB, #16A34A)`, color: 'white' }}>
            <Receipt />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
              {formatCurrency(payment.amount)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {student ? `${student.firstName} ${student.lastName}` : 'طالب غير معروف'}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={onEdit} sx={{ color: theme.palette.primary.main }}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" onClick={onDelete} sx={{ color: theme.palette.error.main }}><Delete fontSize="small" /></IconButton>
          </Box>
        </Box>
        <Grid container spacing={1} sx={{ color: '#64748B' }}>
          <Grid size={{xs: 6}} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPaymentMethodIcon(payment.paymentMethod)}
            <Typography variant="caption">{payment.paymentMethod}</Typography>
          </Grid>
          <Grid size={{xs: 6}} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event sx={{ fontSize: '1rem' }} />
            <Typography variant="caption">{new Date(payment.paymentDate).toLocaleDateString('ar-TN')}</Typography>
          </Grid>
          {payment.receiptNumber && (
            <Grid size={{xs: 12}} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1 }}>
              <ConfirmationNumber sx={{ fontSize: '1rem' }} />
              <Typography variant="caption">إيصال رقم: {payment.receiptNumber}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};


const PaymentTracker: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<Partial<Payment>>({
    studentId: undefined,
    amount: 0,
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    lessonsCount: 0,
    description: '',
    receiptNumber: '',
    status: 'completed',
  });
  const [dialogTitle, setDialogTitle] = useState('إضافة دفعة جديدة');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, studentsData] = await Promise.all([getPayments(), getStudents()]);
        setPayments(paymentsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setAlert({ type: 'error', message: 'فشل تحميل البيانات' });
      }
    };
    fetchData();
  }, []);

  const handleOpen = (payment?: Payment) => {
    if (payment) {
      setForm({
        ...payment,
        paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0], // Format date for input
      });
      setDialogTitle('تعديل الدفعة');
    } else {
      setForm({
        studentId: undefined,
        amount: 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        lessonsCount: 0,
        description: '',
        receiptNumber: '',
        status: 'completed',
      });
      setDialogTitle('إضافة دفعة جديدة');
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setAlert(null);
  };

  const handleChange = (key: keyof Partial<Payment>, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure studentId is a number
    if (!form.studentId) {
        setAlert({ type: 'error', message: 'الرجاء اختيار طالب' });
        return;
    }
    const paymentData = { ...form, studentId: +form.studentId };

    try {
      if (form.id) { // Update existing payment
        const updated = await updatePayment(form.id, paymentData as Payment);
        setPayments(payments.map(p => (p.id === form.id ? updated : p)));
        setAlert({ type: 'success', message: 'تم تحديث الدفعة بنجاح' });
      } else { // Create new payment
        const created = await createPayment(paymentData as Omit<Payment, 'id'>);
        setPayments([created, ...payments]);
        setAlert({ type: 'success', message: 'تمت إضافة الدفعة بنجاح' });
      }
      handleClose();
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'حدث خطأ ما، يرجى المحاولة مرة أخرى' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePayment(id);
      setPayments(payments.filter(p => p.id !== id));
      setAlert({ type: 'success', message: 'تم حذف الدفعة بنجاح' });
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'فشل حذف الدفعة' });
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3, pb: 10 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ mb: 3, fontWeight: 700 }}>
        إدارة الدفعات
      </Typography>

      <Collapse in={!!alert} sx={{ mb: 2 }}>
        {alert && <Alert severity={alert.type} onClose={() => setAlert(null)}>{alert.message}</Alert>}
      </Collapse>

      <Grid container spacing={3}>
        {payments.map(payment => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={payment.id}>
            <PaymentCard
              payment={payment}
              student={students.find(s => s.id === payment.studentId)}
              onEdit={() => handleOpen(payment)}
              onDelete={() => handleDelete(payment.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        onClick={() => handleOpen()}
        sx={{ position: 'fixed', bottom: isMobile ? 16 : 24, right: isMobile ? 16 : 24 }}
        size={isMobile ? 'medium' : 'large'}
      >
        <Add />
      </Fab>

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel>الطالب</InputLabel>
                  <Select
                    value={form.studentId || ''}
                    label="الطالب"
                    onChange={(e) => handleChange('studentId', e.target.value)}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="المبلغ"
                  type="number"
                  fullWidth
                  required
                  value={form.amount || ''}
                  onChange={(e) => handleChange('amount', +e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>طريقة الدفع</InputLabel>
                  <Select
                    value={form.paymentMethod}
                    label="طريقة الدفع"
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  >
                    <MenuItem value="cash">نقداً</MenuItem>
                    <MenuItem value="card">بطاقة</MenuItem>
                    <MenuItem value="bank_transfer">تحويل بنكي</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="تاريخ الدفع"
                  type="date"
                  fullWidth
                  required
                  value={form.paymentDate}
                  onChange={(e) => handleChange('paymentDate', e.target.value)}
                />
              </Grid>
               <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="عدد الحصص"
                  type="number"
                  fullWidth
                  value={form.lessonsCount || ''}
                  onChange={(e) => handleChange('lessonsCount', +e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="رقم الإيصال"
                  fullWidth
                  value={form.receiptNumber}
                  onChange={(e) => handleChange('receiptNumber', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="الوصف"
                  multiline
                  rows={2}
                  fullWidth
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>إلغاء</Button>
            <Button type="submit" variant="contained">
              {form.id ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PaymentTracker;

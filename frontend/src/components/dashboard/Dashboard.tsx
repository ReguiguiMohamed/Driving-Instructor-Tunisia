import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Event,
  AttachMoney,
  DriveEta,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { getStudents } from '../../services/studentService';
import { getLessons } from '../../services/lessonService';
import { getPayments } from '../../services/paymentService';
import { Student, Lesson, Payment } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalLessons: number;
  completedLessons: number;
  todayLessons: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  progress,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.9) 0%, 
          rgba(255, 255, 255, 0.7) 100%)`,
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontFamily: '"Cairo", sans-serif',
                fontWeight: 500,
                mb: 1,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                fontWeight: 700,
                color: '#1F2937',
                mb: 0.5,
                fontFamily: '"Cairo", sans-serif',
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: '#9CA3AF',
                  fontSize: '0.75rem',
                  fontFamily: '"Cairo", sans-serif',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              color: color,
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              '& .MuiSvgIcon-root': {
                fontSize: isMobile ? '1.5rem' : '1.75rem',
              },
            }}
          >
            {icon}
          </Avatar>
        </Box>

        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp
              sx={{
                fontSize: '1rem',
                color: trend >= 0 ? '#10B981' : '#EF4444',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: trend >= 0 ? '#10B981' : '#EF4444',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {trend >= 0 ? '+' : ''}
              {trend}%
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#9CA3AF',
                fontSize: '0.75rem',
              }}
            >
              من الشهر الماضي
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                التقدم
              </Typography>
              <Typography variant="caption" sx={{ color: '#1F2937', fontWeight: 600, fontSize: '0.75rem' }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalLessons: 0,
    completedLessons: 0,
    todayLessons: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsData, lessonsData, paymentsData] = await Promise.all([
          getStudents(),
          getLessons(),
          getPayments(),
        ]);

        // Calculate stats
        const activeStudents = studentsData.filter(s => s.status === 'active').length;
        const completedLessons = lessonsData.filter(l => l.status === 'completed').length;
        const today = new Date().toDateString();
        const todayLessons = lessonsData.filter(
          l => new Date(l.scheduledDateTime).toDateString() === today
        ).length;

        const totalRevenue = paymentsData.reduce((sum, p) => sum + p.amount, 0);
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = paymentsData
          .filter(p => new Date(p.paymentDate).getMonth() === currentMonth)
          .reduce((sum, p) => sum + p.amount, 0);

        const pendingPayments = studentsData.filter(s => s.totalAmountDue > 0).length;

        setStats({
          totalStudents: studentsData.length,
          activeStudents,
          totalLessons: lessonsData.length,
          completedLessons,
          todayLessons,
          totalRevenue,
          monthlyRevenue,
          pendingPayments,
        });

        // Recent students (last 5)
        setRecentStudents(
          studentsData
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );

        // Upcoming lessons (next 5)
        const upcoming = lessonsData
          .filter(l => new Date(l.scheduledDateTime) > new Date() && l.status === 'scheduled')
          .sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime())
          .slice(0, 5);
        setUpcomingLessons(upcoming);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontFamily: '"Amiri", serif', color: '#1F2937' }}>
          جاري التحميل...
        </Typography>
        <Grid container spacing={3}>
          {/* FIXED: Using the 'size' prop as required by your project's MUI version */}
          {[1, 2, 3, 4].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
              <Card sx={{ height: 160, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '1000px 100%', animation: 'shimmer 2s infinite' }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const completionRate = stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0;
  const activeRate = stats.totalStudents > 0 ? (stats.activeStudents / stats.totalStudents) * 100 : 0;

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            fontFamily: '"Amiri", serif',
            fontWeight: 700,
            color: '#1F2937',
            mb: 1,
            textAlign: 'center',
          }}
        >
          مرحباً بك، فايز 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#64748B',
            textAlign: 'center',
            fontFamily: '"Cairo", sans-serif',
          }}
        >
          إليك نظرة عامة على مدرستك لتعليم السياقة اليوم
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* FIXED: Using the 'size' prop as required by your project's MUI version */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="إجمالي الطلاب"
            value={stats.totalStudents}
            subtitle={`${stats.activeStudents} نشط`}
            icon={<People />}
            color="#4A90E2"
            progress={activeRate}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="دروس اليوم"
            value={stats.todayLessons}
            subtitle={`من ${stats.totalLessons} إجمالي`}
            icon={<Event />}
            color="#16A34A"
            trend={15} // Placeholder trend value
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="الإيرادات الشهرية"
            value={formatCurrency(stats.monthlyRevenue)}
            subtitle={`من ${formatCurrency(stats.totalRevenue)} إجمالي`}
            icon={<AttachMoney />}
            color="#FFB347"
            trend={8} // Placeholder trend value
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="الدروس المكتملة"
            value={stats.completedLessons}
            subtitle={`معدل الإنجاز ${Math.round(completionRate)}%`}
            icon={<CheckCircle />}
            color="#10B981"
            progress={completionRate}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Students */}
        {/* FIXED: Using the 'size' prop as required by your project's MUI version */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Cairo", sans-serif',
                    fontWeight: 600,
                    color: '#1F2937',
                  }}
                >
                  الطلاب الجدد
                </Typography>
                <Avatar sx={{ background: 'rgba(74, 144, 226, 0.1)', color: '#4A90E2', width: 32, height: 32 }}>
                  <People sx={{ fontSize: '1.2rem' }} />
                </Avatar>
              </Box>

              {recentStudents.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 3 }}>
                  لا يوجد طلاب جدد
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentStudents.map((student, index) => (
                    <Box
                      key={student.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          transform: 'translateX(-4px)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, #2563EB${index * 20 + 20}, #16A34A${index * 15 + 15})`,
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {student.firstName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#1F2937',
                            fontFamily: '"Cairo", sans-serif',
                          }}
                        >
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            fontSize: '0.75rem',
                          }}
                        >
                          {student.phoneNumber}
                        </Typography>
                      </Box>
                      <Chip
                        label={student.licenseType}
                        size="small"
                        sx={{
                          background: 'rgba(74, 144, 226, 0.1)',
                          color: '#4A90E2',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Lessons */}
        {/* FIXED: Using the 'size' prop as required by your project's MUI version */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Cairo", sans-serif',
                    fontWeight: 600,
                    color: '#1F2937',
                  }}
                >
                  الدروس القادمة
                </Typography>
                <Avatar sx={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', width: 32, height: 32 }}>
                  <Schedule sx={{ fontSize: '1.2rem' }} />
                </Avatar>
              </Box>

              {upcomingLessons.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', py: 3 }}>
                  لا توجد دروس مجدولة
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {upcomingLessons.map((lesson, index) => (
                    <Box
                      key={lesson.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.8)',
                          transform: 'translateX(-4px)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, #16A34A${index * 20 + 20}, #F59E0B${index * 15 + 15})`,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <DriveEta sx={{ fontSize: '1.2rem' }} />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: '#1F2937',
                            fontFamily: '"Cairo", sans-serif',
                          }}
                        >
                          {lesson.student?.firstName} {lesson.student?.lastName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            fontSize: '0.75rem',
                          }}
                        >
                          {new Date(lesson.scheduledDateTime).toLocaleDateString('ar-TN')} -{' '}
                          {new Date(lesson.scheduledDateTime).toLocaleTimeString('ar-TN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                      <Chip
                        label={lesson.lessonType === 'practical' ? 'عملي' : 'نظري'}
                        size="small"
                        sx={{
                          background:
                            lesson.lessonType === 'practical'
                              ? 'rgba(80, 200, 120, 0.1)'
                              : 'rgba(255, 179, 71, 0.1)',
                          color: lesson.lessonType === 'practical' ? '#16A34A' : '#F59E0B',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {stats.pendingPayments > 0 && (
        <Box sx={{ mt: 3 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Cairo", sans-serif',
                      fontWeight: 600,
                      color: '#EF4444',
                    }}
                  >
                    تنبيه: مدفوعات معلقة
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748B',
                      fontFamily: '"Cairo", sans-serif',
                    }}
                  >
                    لديك {stats.pendingPayments} طالب بمدفوعات معلقة تحتاج للمتابعة
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
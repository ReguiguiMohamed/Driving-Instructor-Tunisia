import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Badge,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getPendingNotifications, markNotificationAsSent } from '../../services/notificationService';
import generateReminders from '../../services/reminderService';
import type { Notification } from '../../types';
import NotificationMenu from './NotificationMenu';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { label: 'الرئيسية', path: '/', icon: DashboardIcon },
  { label: 'الطلاب', path: '/students', icon: PeopleIcon },
  { label: 'الدروس', path: '/lessons', icon: EventIcon },
  { label: 'المدفوعات', path: '/payments', icon: PaymentIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingNotifications, setPendingNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsSent(id);
      setPendingNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await generateReminders();
        const data = await getPendingNotifications();
        setPendingNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentNavIndex = () => {
    const index = navigationItems.findIndex(item => item.path === location.pathname);
    return index === -1 ? 0 : index;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-TN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-TN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        direction: 'rtl',
        background: `linear-gradient(135deg,
            rgba(30, 41, 59, 0.6) 0%,
            rgba(15, 23, 42, 0.95) 100%)`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(30, 41, 59, 0.3)',
          zIndex: theme.zIndex.drawer + 1,
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: { xs: 56, sm: 64 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <DriveEtaIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontFamily: '"Amiri", "Cairo", serif',
                }}
              >
                مدرسة فايز لتعليم السياقة
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.75rem',
                }}
              >
                {formatDate(currentTime)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                minWidth: '60px',
                textAlign: 'center',
              }}
            >
              {formatTime(currentTime)}
            </Typography>
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Badge badgeContent={pendingNotifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <NotificationMenu 
              notifications={pendingNotifications}
              anchorEl={anchorEl}
              onClose={handleNotificationClose}
              onMarkAsRead={handleMarkAsRead}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isMobile
            ? 'calc(64px + env(safe-area-inset-top))'
            : 'calc(72px + env(safe-area-inset-top))',
          pb: isMobile ? 'calc(110px + env(safe-area-inset-bottom))' : '24px',
          px: isMobile ? 1 : 3,
          minHeight: '100vh',
        }}
      >
        {/* Content Container with Glass Effect */}
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255, 11, 11, 0)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minHeight: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 112px)',
            p: isMobile ? 2 : 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            }
          }}
        >
          {children}
        </Paper>
      </Box>

       {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 'calc(env(safe-area-inset-bottom) + 24px)',  // raise above system nav
            zIndex: theme.zIndex.drawer + 1,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none', // let only the dock receive clicks
          }}
        >
          <Paper
            elevation={8}
            sx={{
              pointerEvents: 'auto',
              background: 'rgba(31, 41, 55, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              borderRadius: '20px',
              px: 1,
              py: 0.5,
              width: 'min(640px, calc(100% - 24px))',            // inset from edges
            }}
          >
            <BottomNavigation
              value={getCurrentNavIndex()}
              sx={{
                backgroundColor: 'transparent',
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.75,
                  '&.Mui-selected': {
                    color: '#FFFFFF',
                    '& .MuiBottomNavigationAction-label': { fontSize: '0.75rem', fontWeight: 600 },
                    '& .MuiSvgIcon-root': { transform: 'scale(1.15)' }
                  },
                  '&:not(.Mui-selected)': { color: '#E5E7EB' },
                  '& .MuiBottomNavigationAction-label': { fontFamily: '"Cairo", sans-serif', fontSize: '0.7rem', mt: '4px' },
                  borderRadius: '12px',
                  transition: 'all 0.25s ease',
                  '&:hover': { backgroundColor: 'rgba(30,41,59,0.18)' },
                }
              }}
            >
              {navigationItems.map((item) => (
                <BottomNavigationAction
                  key={item.path}
                  label={item.label}
                  icon={<item.icon />}
                  component={Link}
                  to={item.path}
                />
              ))}
            </BottomNavigation>
          </Paper>
        </Box>
      )}

      {/* Desktop Side Navigation */}
      {!isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            right: 0,
            top: '88px',
            bottom: 0,
            width: '80px',
            background: 'rgba(31, 41, 55, 0.9)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: theme.zIndex.drawer,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 3,
            gap: 2,
          }}
          elevation={0}
        >
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <IconButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: isActive
                    ? 'rgba(30, 41, 59, 0.2)'
                    : 'transparent',
                  color: isActive ? '#FFFFFF' : '#D1D5DB',
                  border: isActive
                    ? '2px solid rgba(30, 41, 59, 0.3)'
                    : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 41, 59, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(30, 41, 59, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: '24px',
                    color: isActive ? 'var(--selected-nav-color)' : undefined,
                  }
                }}
              >
                <item.icon />
              </IconButton>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export default Layout;
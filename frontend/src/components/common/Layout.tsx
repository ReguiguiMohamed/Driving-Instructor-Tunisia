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
import { Notification } from '../../types';
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
            rgba(30, 58, 138, 0.6) 0%,
            rgba(17, 24, 39, 0.95) 100%)`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
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
                مدرسة فيروز لتعليم السياقة
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
          pt: isMobile ? '80px' : '88px',
          pb: isMobile ? '80px' : '24px',
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
              background: 'linear-gradient(90deg, #2563EB, #16A34A, #F59E0B)',
            }
          }}
        >
          {children}
        </Paper>
      </Box>

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer + 1,
            background: 'rgba(31, 41, 55, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
            paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          }}
          elevation={0}
        >
          <BottomNavigation
            value={getCurrentNavIndex()}
            sx={{
              backgroundColor: 'transparent',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                padding: '8px 12px 10px',
                '&.Mui-selected': {
                  color: '#1E40AF',
                  '& .MuiBottomNavigationAction-label': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  },
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.2)',
                    filter: 'drop-shadow(0 2px 4px rgba(30, 58, 138, 0.4))',
                  }
                },
                '&:not(.Mui-selected)': {
                  color: '#D1D5DB',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontFamily: '"Cairo", sans-serif',
                  fontSize: '0.7rem',
                  marginTop: '4px',
                },
                transition: 'all 0.3s ease',
              }
            }}
          >
            {navigationItems.map((item, index) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={<item.icon />}
                component={Link}
                to={item.path}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.2)',
                    borderRadius: '12px',
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
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
                    ? 'rgba(30, 58, 138, 0.2)'
                    : 'transparent',
                  color: isActive ? '#1E40AF' : '#D1D5DB',
                  border: isActive
                    ? '2px solid rgba(30, 58, 138, 0.3)'
                    : '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(30, 58, 138, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(30, 58, 138, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: '24px',
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
import React from 'react';
import { Menu, MenuItem, Typography, Box, IconButton } from '@mui/material';
import type { Notification as AppNotification } from '../../types';
import { Close } from '@mui/icons-material';

interface NotificationMenuProps {
  notifications: AppNotification[];
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ notifications, anchorEl, onClose, onMarkAsRead }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#F9FAFB',
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">الإشعارات</Typography>
        <IconButton onClick={onClose} size="small">
          <Close sx={{ color: '#F9FAFB' }} />
        </IconButton>
      </Box>
      {notifications.length === 0 ? (
        <MenuItem onClick={onClose}>
          <Typography>لا توجد إشعارات جديدة</Typography>
        </MenuItem>
      ) : (
        notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={() => onMarkAsRead(notification.id)}>
            <Box>
              <Typography variant="subtitle2">{notification.title}</Typography>
              <Typography variant="body2" sx={{ color: '#D1D5DB' }}>{notification.message}</Typography>
            </Box>
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default NotificationMenu;

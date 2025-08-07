import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingProps {
  title?: string;
  cards?: number;
}

const Loading: React.FC<LoadingProps> = ({ title = 'جاري التحميل...' }) => {
  return (
    <Box
      sx={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#D1D5DB',
      }}
      className="fade-in"
    >
      <CircularProgress color="primary" />
      <Typography sx={{ mt: 2, fontFamily: '"Cairo", sans-serif' }}>{title}</Typography>
    </Box>
  );
};

export default Loading;

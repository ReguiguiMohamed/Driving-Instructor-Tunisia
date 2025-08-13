import React from 'react';
import { Box } from '@mui/material';

const SplashScreen: React.FC = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background-primary)',
    }}
  >
    <img src="/splash.png" alt="App Splash" style={{ maxWidth: '60%' }} />
  </Box>
);

export default SplashScreen;

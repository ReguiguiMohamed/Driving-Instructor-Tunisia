import React, { useEffect, useState } from 'react';
import { Box, Fade, Typography, SxProps, Theme } from '@mui/material';

interface AddHintProps {
  message: string;
  sx?: SxProps<Theme>;
}

const AddHint: React.FC<AddHintProps> = ({ message, sx }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={visible} timeout={{ enter: 500, exit: 500 }}>
      <Box
        sx={{
          position: 'fixed',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 2,
          py: 1,
          borderRadius: 1,
          boxShadow: 3,
          zIndex: (theme) => theme.zIndex.tooltip,
          ...sx,
        }}
      >
        <Typography variant="caption">{message}</Typography>
      </Box>
    </Fade>
  );
};

export default AddHint;

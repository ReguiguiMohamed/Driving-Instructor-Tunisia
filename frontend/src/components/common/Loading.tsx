import React from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';

interface LoadingProps {
  title?: string;
  cards?: number;
}

const Loading: React.FC<LoadingProps> = ({ title = 'جاري التحميل...', cards = 4 }) => {
  return (
    <Box sx={{ p: 3 }} className="fade-in">
      <Typography variant="h4" sx={{ mb: 3, fontFamily: '"Amiri", serif', color: '#1F2937' }}>
        {title}
      </Typography>
      <Grid container spacing={3}>
        {Array.from({ length: cards }).map((_, idx) => (
          // FIXED: Using the 'size' prop as required by MUI v5 Grid
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                height: 160,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '1000px 100%',
                animation: 'shimmer 2s infinite'
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Loading;

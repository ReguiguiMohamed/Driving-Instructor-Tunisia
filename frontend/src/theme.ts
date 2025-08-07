import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4A90E2' },
    secondary: { main: '#16A34A' },
    background: {
      default: '#F8FAFC',
      paper: 'rgba(255,255,255,0.7)',
    },
  },
  typography: {
    fontFamily: '"Cairo", sans-serif',
    h1: { fontFamily: '"Amiri", serif' },
    h2: { fontFamily: '"Amiri", serif' },
    h3: { fontFamily: '"Amiri", serif' },
    h4: { fontFamily: '"Amiri", serif' },
  },
});

export default theme;

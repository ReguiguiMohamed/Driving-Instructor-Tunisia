import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C3AED' },
    secondary: { main: '#0D9488' },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
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

'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Remove any custom fontFamily to use MUI's default
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#EF6C00', // Replace with your desired color
    },
  },
});

export default theme;

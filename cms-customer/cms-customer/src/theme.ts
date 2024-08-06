'use client';
import { createTheme } from '@mui/material/styles';

// Load the Open Sans font
import '@fontsource/open-sans'; 

const theme = createTheme({
  typography: {
    // Use Open Sans font
    fontFamily: 'Open Sans, Roboto, Arial, sans-serif',
    
//fontFamily: 'Roboto, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#EF6C00', // Replace with your desired color
    },
  },
});

export default theme;

    


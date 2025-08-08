import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f97316', // Tailwind's orange-500
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32', // MUI's success green
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f', // MUI's error red
      contrastText: '#fff',
    },
  },
  components: {
    // Default button styles
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#f97316',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ea580c',
          },
          '&.Mui-disabled': {
            backgroundColor: '#bdbdbd',
            color: '#fff',
          },
        },
      },
    },
    // Default TextField-related styles
    MuiTextField: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#f97316',
          '&.Mui-focused': {
            color: '#f97316',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f97316',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ea580c',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f97316',
          },
        },
      },
    },
  },
});

export default theme;

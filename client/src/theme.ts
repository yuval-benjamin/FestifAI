import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
   MuiStep: {
        styleOverrides: {
            root: {
                // backdropFilter: 'blur(5px)', // Apply blur effect
                // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
                // borderRadius: '10px',
            },
        },
   },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'gray', // Default color for inactive steps
          '&.Mui-active': {
            color: '#FF3366', // Active step color
          },
          '&.Mui-completed': {
            color: '#FF3366', // Completed step color
          },
        },
        text: {
            fontSize: '20px',
            fontFamily: 'bangers', // Font family for step icon text
        }
      },
    },
    MuiStepLabel: {
      styleOverrides: {
    
        label: {
          color: 'white',
          fontSize: '22px',
          fontFamily: 'bangers', // Default label color
          '&.Mui-active': {
            color: 'white', // Active label color
          },
          '&.Mui-completed': {
            color: 'white', // Completed label color
          },
        },
      },
    },
  },
});

export default theme;
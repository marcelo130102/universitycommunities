import { createTheme, ThemeOptions } from '@mui/material/styles';

interface CustomThemeOptions extends ThemeOptions {
  customColors?: {
    color1?: string;
    color2?: string;
    color3?: string;
    color4?: string;
    color5?: string;
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#15191d', // color1
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4b538b', // color2
      contrastText: '#ffffff',
    },
    text:{
        primary: '#ffffff',
        secondary: '#4b538b'
    },
    // Puedes definir más colores aquí si es necesario
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
    },
  },
  customColors: {
    color1: '#6b7b79',
    color2: '#50605e',
    color3: '#354542',
    color4: '#1b2927',
    color5: '#000e0b',
  },
  components:{
    MuiPaper:{
        styleOverrides:{
            root:{
            backgroundColor: '#15191d',
            color: '#ffffff'
            }
        }
    
    },
    MuiSvgIcon:{
        styleOverrides:{
            root:{
                color: '#ffffff'
            }
        }
    },
    MuiFormLabel:{
        styleOverrides:{
            root:{
                color: '#ffffff',
                '&.Mui-focused':{
                    color: '#ffffff'
                }
            }
            
        }
    },
    MuiInputBase:{
        styleOverrides:{
            root:{
                color: '#ffffff',
                borderColor: '#ffffff',
            }
        }
    },
    MuiTextField:{
        styleOverrides:{
            root:{
                color: '#ffffff',
                borderColor: '#ffffff',
            }
        }
    }
  }
} as CustomThemeOptions);

export default theme;
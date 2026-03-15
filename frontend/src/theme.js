import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#184d7a',
    },
    secondary: {
      main: '#d97706',
    },
    success: {
      main: '#198754',
    },
    error: {
      main: '#c2410c',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: "Aptos, 'Segoe UI Variable', 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "Bahnschrift, 'Segoe UI Variable', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: "Bahnschrift, 'Segoe UI Variable', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: "Bahnschrift, 'Segoe UI Variable', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.75rem',
      lineHeight: 1.25,
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.3rem',
      lineHeight: 1.2,
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      lineHeight: 1.3,
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 14,
          minHeight: 38,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 14,
          '&:last-child': {
            paddingBottom: 14,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          background: '#184d7a',
          color: '#f9fafb',
        },
      },
    },
  },
})

export default theme
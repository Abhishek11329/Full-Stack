/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0d47a1' : '#90caf9', // Deep Blue or light blue
          },
          secondary: {
            main: '#00bfa5', // Teal
          },
          background: {
            default: mode === 'light' ? '#f4f6f8' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' ? '0 4px 6px rgba(0,0,0,0.04)' : '0 4px 6px rgba(0,0,0,0.4)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

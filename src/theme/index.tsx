'use client';

import { ReactNode } from 'react';
import GlobalStyles from './globalStyles';
import { Nunito_Sans } from 'next/font/google';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, StyledEngineProvider, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

interface IThemeProviderProps {
  children: ReactNode;
}

const font = Nunito_Sans({ subsets: ['latin', 'latin-ext'] });

export default function ThemeProvider({ children }: IThemeProviderProps) {
  const theme = createTheme({
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: font.style.fontFamily,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

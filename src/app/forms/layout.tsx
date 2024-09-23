import Image from 'next/image';
import { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

export default function FormsPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppBar elevation={0} color="inherit" position="static">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Image alt="logo" src="/assets/ats_logo.svg" width={320} height={80} />
        </Toolbar>
      </AppBar>
      <Container sx={{ minHeight: 'calc(100vh - 80px)' }}>{children}</Container>
    </>
  );
}

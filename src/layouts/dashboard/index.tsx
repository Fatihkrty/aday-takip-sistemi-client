'use client';

import Header from './header';
import paths from '@/routes/paths';
import Box from '@mui/material/Box';
import { SidePanel } from './side-panel';
import { DRAWER_WIDTH } from '../config';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';
import Toolbar from '@mui/material/Toolbar';
import { ReactNode, useEffect } from 'react';
import Container from '@mui/material/Container';
import { useBoolean } from '@/hooks/useBoolean';
import { useAuthContext } from '@/auth/hooks/useAuthContext';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { replace } = useRouter();
  const openHeader = useBoolean(true);
  const { authenticated } = useAuthContext();

  useEffect(() => {
    if (!authenticated) {
      replace(paths.login);
    }
  }, [authenticated, replace]);

  if (!authenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header openHeader={openHeader} />

      <SidePanel open={openHeader.value} />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          borderRadius: 2,
          width: `calc(100% - ${DRAWER_WIDTH}px - 48px)`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${DRAWER_WIDTH}px`,
          ...(openHeader.value && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        })}
      >
        <Toolbar variant="dense" />

        <Divider />

        <Container maxWidth={false} sx={{ mt: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

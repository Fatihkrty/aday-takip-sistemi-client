import Image from 'next/image';
import Box from '@mui/material/Box';
import Account from './_sections/Account';
import NavList from './_sections/NavList';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import { DRAWER_WIDTH } from '@/layouts/config';

interface ISidePanelProps {
  open: boolean;
}

export function SidePanel({ open }: ISidePanelProps) {
  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={open}
      sx={{
        flexShrink: 0,
        width: DRAWER_WIDTH,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar variant="dense">
        <Image alt="logo" src="/assets/ats_logo_2.svg" width={320} height={80} />
      </Toolbar>

      <Divider sx={{ mt: 2 }} />

      <Box sx={{ overflow: 'auto' }}>
        <Account />

        <Divider sx={{ py: 1 }} />

        <NavList />
      </Box>
    </Drawer>
  );
}

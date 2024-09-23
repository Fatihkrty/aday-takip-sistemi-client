'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { DRAWER_WIDTH } from '@/layouts/config';
import IconButton from '@mui/material/IconButton';
import { UseBooleanOutput } from '@/hooks/useBoolean';
import AccountPopover from './_sections/AccountPopover';
import NotificationPopover from './_sections/NotificationPopover';

interface IHeaderProps {
  openHeader: UseBooleanOutput;
}

export default function Header({ openHeader }: IHeaderProps) {
  return (
    <AppBar
      elevation={0}
      color="inherit"
      position="fixed"
      sx={(theme) => ({
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(openHeader.value && {
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          marginLeft: `${DRAWER_WIDTH}px`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
        // backgroundColor: '#f8f8fc',
        // zIndex: (theme) => theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar variant="dense">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          aria-label="menu"
          onClick={openHeader.toggle}
        >
          <MenuIcon />
        </IconButton>

        <Box flexGrow={1} />

        <Stack flexDirection="row" sx={{ marginRight: 15 }}>
          <NotificationPopover />
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
  // return (
  //   <AppBar
  //     elevation={1}
  //     position="fixed"
  //     sx={{
  //       // borderBottom: '1px solid lightgrey',
  //       zIndex: (theme) => theme.zIndex.drawer + 1,
  //       // bgcolor: 'Background',
  //       // background: 'linear-gradient(to right, #384c9e, #65479d)',
  //     }}
  //   >
  //     <Toolbar>
  //       <Box
  //         sx={{
  //           top: 10,
  //           left: 10,
  //           position: 'absolute',
  //         }}
  //       >
  //         <IconButton onClick={toggleSidePanel}>
  //           <MenuIcon />
  //         </IconButton>
  //       </Box>

  //       <Box
  //         sx={{
  //           height: 1,
  //           display: 'flex',
  //           flexWrap: 'wrap',
  //           alignItems: 'center',
  //           justifyContent: 'space-around',
  //         }}
  //       >
  //         <Image width={260} height={64} alt="logo" src="/assets/ats_logo.svg" />

  //         <Box>
  //           <Typography variant="h4" fontWeight="bold">
  //             Aday Takip Sistemi
  //           </Typography>
  //         </Box>

  //         <Box display="flex" alignItems="center">
  //           <NotificationPopover />

  //           <AccountPopover />
  //         </Box>
  //       </Box>
  //     </Toolbar>
  //   </AppBar>
  // );
}

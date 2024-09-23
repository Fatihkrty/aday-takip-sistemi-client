'use client';

import React, { ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarKey, useSnackbar, SnackbarProvider as NotistackProvider } from 'notistack';

function CloseButton({ actionKey }: { actionKey: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton onClick={() => closeSnackbar(actionKey)}>
      <CloseIcon sx={{ color: 'white' }} />
    </IconButton>
  );
}

export default function SnackbarProvider(props: { children: ReactNode }) {
  return (
    <NotistackProvider
      maxSnack={3}
      variant="success"
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      action={(actionKey) => <CloseButton actionKey={actionKey} />}
    >
      {props.children}
    </NotistackProvider>
  );
}

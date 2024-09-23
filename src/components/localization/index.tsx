'use client';

import dayjs from 'dayjs';
import LocaleTr from 'dayjs/locale/tr';
import React, { ReactNode } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers';

dayjs.locale(LocaleTr);

export default function LocalizationProvider(props: { children: ReactNode }) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
      {props.children}
    </MuiLocalizationProvider>
  );
}

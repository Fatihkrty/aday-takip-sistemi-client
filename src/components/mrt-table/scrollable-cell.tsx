import { ReactNode } from 'react';
import Box from '@mui/material/Box';

type Props = {
  children: string | ReactNode;
};

export default function ScrollableCell({ children }: Props) {
  return (
    <Box
      maxHeight={120}
      overflow="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey',
          borderRadius: 2,
        },
      }}
    >
      {children}
    </Box>
  );
}

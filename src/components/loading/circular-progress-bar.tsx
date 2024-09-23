import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

interface ICircularProgressWithLabelProps {
  total: number;
  current: number;
}

export default function CircularProgressBar({
  total,
  current,
  ...props
}: CircularProgressProps & ICircularProgressWithLabelProps) {
  const percent = Math.round((current * 100) / total);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={percent} {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="inherit" component="div" color="text.secondary">{`${percent}%`}</Typography>
      </Box>
    </Box>
  );
}

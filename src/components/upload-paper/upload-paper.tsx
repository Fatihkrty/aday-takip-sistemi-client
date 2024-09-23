import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import CloudUpload from '@mui/icons-material/CloudUpload';

interface Props extends PaperProps {
  error?: boolean;
  sx?: SxProps;
  helperText?: string;
  children?: ReactNode;
}

export default function UploadPaper({ children, sx, error, helperText, ...props }: Props) {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={(t) => ({
          p: 4,
          display: 'flex',
          cursor: 'pointer',
          bgcolor: error ? alpha(t.palette.error.main, 0.3) : 'divider',
          alignItems: 'center',
          justifyContent: 'center',
          ':hover': {
            bgcolor: error ? alpha(t.palette.error.main, 0.2) : alpha(t.palette.divider, 0.2),
          },
          ...sx,
        })}
        {...props}
      >
        <Stack alignItems="center" justifyContent="center">
          <CloudUpload sx={{ width: 56, height: 56, color: 'success.main' }} />

          {children}
        </Stack>
      </Paper>
      {helperText && (
        <Typography variant="caption" color={error ? 'error.main' : 'inherit'}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

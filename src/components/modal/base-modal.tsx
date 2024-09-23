import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';

interface Props extends DialogProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function BaseModal({ open, onClose, title, children, maxWidth, ...props }: Props) {
  return (
    <Dialog {...props} open={open} fullWidth maxWidth={maxWidth ?? 'md'}>
      <DialogTitle textAlign={'center'}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box width={40} />

          <Typography fontWeight={'bold'} fontSize={24}>
            {title}
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider />
      </DialogTitle>

      {children}
    </Dialog>
  );
}

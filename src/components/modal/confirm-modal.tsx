import { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

interface IConfirmModalProps {
  open: boolean;
  loading?: boolean;

  onAccept: () => void;
  onCancel: () => void;

  title: string;
  children: string | ReactNode;

  acceptLabel: string;
  cancelLabel: string;
  reverseColor?: boolean;
}

export default function ConfirmModal({
  open,
  loading,

  onAccept,
  onCancel,

  title,
  children,

  acceptLabel,
  cancelLabel,
  reverseColor,
}: IConfirmModalProps) {
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center" fontWeight="bold">
        {title}
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        <LoadingButton
          loading={loading}
          sx={{ textTransform: 'none' }}
          onClick={onAccept}
          variant="contained"
          color={reverseColor ? 'error' : 'success'}
        >
          {acceptLabel}
        </LoadingButton>
        <Button sx={{ textTransform: 'none' }} onClick={onCancel} color={reverseColor ? 'inherit' : 'error'}>
          {cancelLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

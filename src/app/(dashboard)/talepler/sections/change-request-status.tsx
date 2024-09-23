import { useSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { IRequest } from '@/types/IRequest';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import { RequestStatus } from '@/constants/request-status';
import { useChangeRequestStatusApi } from '@/api/useRequestApi';
import { enumToArray, getRequestStatusText } from '@/utils/enum';

interface Props {
  request?: IRequest;
  onSuccess?: () => void;
}

export default function ChangeRequestStatus({ request, onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState<RequestStatus>(request?.status || RequestStatus.open);
  const { mutateAsync: changeRequestStatus, isPending: changeStatusLoading } = useChangeRequestStatusApi();

  const handleChangeStatus = () => {
    if (request?.id) {
      changeRequestStatus(
        { id: request.id, status },
        {
          onSuccess() {
            enqueueSnackbar('Durum değiştirildi');
            onSuccess?.();
          },
          onError(error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    }
  };

  useEffect(() => {
    if (request) {
      setStatus(request.status);
    }
  }, [request]);

  return (
    <Stack spacing={2} p={3}>
      <FormControl fullWidth>
        <InputLabel>Talep Durumu</InputLabel>
        <Select label="Talep Durumu" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {enumToArray(RequestStatus).map((x) => (
            <MenuItem key={x} value={x}>
              {getRequestStatusText(x)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LoadingButton onClick={handleChangeStatus} fullWidth loading={changeStatusLoading} variant="contained">
        Kaydet
      </LoadingButton>
    </Stack>
  );
}

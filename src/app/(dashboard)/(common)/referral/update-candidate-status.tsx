'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import { IReferralForm } from '@/types/IReferral';
import LoadingButton from '@mui/lab/LoadingButton';
import { zodResolver } from '@hookform/resolvers/zod';
import InputAdornment from '@mui/material/InputAdornment';
import { useUpsertReferralApi } from '@/api/useReferralApi';
import { CandidateStatus } from '@/constants/candidate-status';
import FormProvider from '@/components/hook-form/form-provider';
import { enumToArray, getCandidateStatusText } from '@/utils/enum';
import { InputSelect, InputTextField, InputNumberField } from '@/components/hook-form';

interface Props {
  referral?: IReferralForm;
  onSuccessUpdate?: () => void;
}

const scheme = z.object({
  status: z.nativeEnum(CandidateStatus),
  candidateId: z.coerce.number({ invalid_type_error: 'Geçerli değer girin' }).positive('Geçerli değer girin'),
  requestId: z.coerce.number({ invalid_type_error: 'Geçerli değer girin' }).positive('Geçerli değer girin'),
});

export default function UpdateCandidateStatus({ referral, onSuccessUpdate }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: upsertReferral, isPending: updateLoading } = useUpsertReferralApi();

  const methods = useForm<IReferralForm>({
    defaultValues: { status: CandidateStatus.evaluation },
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    upsertReferral(data, {
      onSuccess() {
        enqueueSnackbar('Kaydedildi');
        onSuccessUpdate?.();
      },
      onError(error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    });
  });

  useEffect(() => {
    if (referral) {
      methods.reset({
        status: referral.status,
        requestId: referral.requestId,
        candidateId: referral.candidateId,
        description: referral.description,
      });
    }
  }, [referral, methods]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack sx={{ p: 3 }} spacing={2}>
        <Stack spacing={2} direction={'row'}>
          <InputNumberField
            InputProps={{
              startAdornment: <InputAdornment position="start">#</InputAdornment>,
            }}
            fullWidth
            disabled={!!referral?.candidateId}
            name="candidateId"
            label="Aday Numarası"
          />
          <InputNumberField
            InputProps={{
              startAdornment: <InputAdornment position="start">#</InputAdornment>,
            }}
            fullWidth
            disabled={!!referral?.requestId}
            name="requestId"
            label="Talep Numarası"
          />
        </Stack>

        <InputSelect name="status" label="Durum">
          {enumToArray(CandidateStatus).map((x) => (
            <MenuItem key={x} value={x}>
              {getCandidateStatusText(x)}
            </MenuItem>
          ))}
        </InputSelect>

        <InputTextField name="description" label="Açıklama" multiline rows={3} placeholder="İsteğe bağlı" />

        <LoadingButton loading={updateLoading} variant="contained" type="submit">
          Kaydet
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

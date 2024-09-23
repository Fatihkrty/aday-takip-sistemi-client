'use client';

import { z } from 'zod';
import { useState } from 'react';
import paths from '@/routes/paths';
import { zodEmail } from '@/utils/zod';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { forgotPasswordAPI } from '@/api/authApi';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthBasePage from '../_section/auth-base-page';
import { zodResolver } from '@hookform/resolvers/zod';
import ReturnLoginPage from '../_section/return-login-page';
import { IForgotPasswordForm } from '@/types/IForgotPasswordForm';
import FormProvider, { InputTextField } from '@/components/hook-form';

const defaultValues = { email: null };

const scheme = z.object({ email: zodEmail() });

export default function ForgotPasswordPage() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const onSubmit = methods.handleSubmit(async (data: IForgotPasswordForm) => {
    setLoading(true);
    try {
      await forgotPasswordAPI(data);
      push(`${paths.resetPassword}?email=${data.email}`);
    } catch (error) {
      const err = error as Error;
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthBasePage>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Alert sx={{ fontSize: 15 }} severity="warning">
            Şifre sıfırlama e-postası almak için lütfen sistemde kayıtlı e-posta adresinizi girin
          </Alert>

          <InputTextField fullWidth name="email" label="E-Posta" />
          <LoadingButton
            type="submit"
            loading={loading}
            sx={{ textTransform: 'none', fontSize: 16, fontWeight: 'bold' }}
            variant="contained"
          >
            Sıfırla
          </LoadingButton>

          <ReturnLoginPage />
        </Stack>
      </FormProvider>
    </AuthBasePage>
  );
}

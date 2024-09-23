'use client';

import { z } from 'zod';
import NextLink from 'next/link';
import paths from '@/routes/paths';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { ILoginForm } from '@/types/ILoginForm';
import IconButton from '@mui/material/IconButton';
import { useSearchParams } from 'next/navigation';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthBasePage from '../_section/auth-base-page';
import { zodEmail, zodBaseString } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuthContext } from '@/auth/hooks/useAuthContext';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormProvider, { InputTextField } from '@/components/hook-form';

const scheme = z.object({
  email: zodEmail(),
  password: zodBaseString.min(6, 'En az 6 karakter girin'),
});

const defaultValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const { login } = useAuthContext();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isExpired = params.get('expired') === 'true';
  const [alert, setAlert] = useState<string | null>(null);

  const methods = useForm<ILoginForm>({
    defaultValues,
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const onSubmit = methods.handleSubmit(async (loginData: ILoginForm) => {
    setAlert(null);
    setLoading(true);
    try {
      await login(loginData);
    } catch (error) {
      const err = error as Error;
      setAlert(err.message);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (isExpired) {
      enqueueSnackbar('Oturum süresi doldu. Lütfen tekrar giriş yapın', { variant: 'warning', autoHideDuration: 5000 });
    }
  }, [isExpired]);

  return (
    <AuthBasePage>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          {alert ? <Alert severity="error">{alert}</Alert> : null}
          <InputTextField fullWidth name="email" label="E-posta" />

          <Stack>
            <InputTextField
              fullWidth
              name="password"
              label="Şifre"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass((old) => !old)}>
                      {showPass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              type={showPass ? 'text' : 'password'}
            />

            <Link
              passHref
              underline="hover"
              component={NextLink}
              href={paths.forgotPassword}
              sx={{ alignSelf: 'end', mt: 1 }}
            >
              Şifremi unuttum
            </Link>
          </Stack>

          <LoadingButton
            type="submit"
            loading={loading}
            color="primary"
            variant="contained"
            sx={{ textTransform: 'none', fontSize: 16, fontWeight: 'bold' }}
          >
            Giriş Yap
          </LoadingButton>
        </Stack>
      </FormProvider>
    </AuthBasePage>
  );
}

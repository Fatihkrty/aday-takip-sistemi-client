'use client';

import { z } from 'zod';
import { useState } from 'react';
import paths from '@/routes/paths';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { resetPasswordAPI } from '@/api/authApi';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { zodEmail, zodBaseString } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Visibility from '@mui/icons-material/Visibility';
import AuthBasePage from '../../_section/auth-base-page';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter, useSearchParams } from 'next/navigation';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ReturnLoginPage from '../../_section/return-login-page';
import { IResetPasswordForm } from '@/types/IResetPasswordForm';
import FormProvider, { InputTextField } from '../../../../components/hook-form';

const scheme = z
  .object({
    email: zodEmail(),
    verifyCode: zodBaseString,
    password: zodBaseString.min(6, 'En az 6 karakter girin'),
    confirmPassword: zodBaseString.min(6, 'En az 6 karakter girin'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
      });
    }
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || null;
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const defaultValues: IResetPasswordForm = {
    email,
    verifyCode: null,
    password: null,
    confirmPassword: null,
  };

  const methods = useForm<IResetPasswordForm>({
    defaultValues,
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const onSubmit = async (data: IResetPasswordForm) => {
    setLoading(true);
    try {
      delete (data as any).confirmPassword;
      await resetPasswordAPI(data);
      router.push(paths.login);
    } catch (error) {
      const err = error as Error;
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    methods.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <AuthBasePage>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Alert sx={{ alignItems: 'center' }}>
            <strong>{email}</strong> adresinizi kontrol edin. <br />
            E-posta üzerindeki doğrulama kodu ile şifrenizi sıfırlayabilirsiniz.
          </Alert>

          <InputTextField name="verifyCode" label="Doğrulama Kodu" fullWidth />

          <InputTextField
            fullWidth
            name="password"
            label="Yeni Şifre"
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

          <InputTextField
            fullWidth
            name="confirmPassword"
            label="Yeni Şifre Onayı"
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

          <LoadingButton
            type="submit"
            loading={loading}
            variant="contained"
            sx={{ textTransform: 'none', fontSize: 16, fontWeight: 'bold' }}
          >
            Şifremi Sıfırla
          </LoadingButton>

          <ReturnLoginPage />
        </Stack>
      </FormProvider>
    </AuthBasePage>
  );
}

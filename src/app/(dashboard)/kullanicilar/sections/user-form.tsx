import { z } from 'zod';
import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import getDirtyFields from '@/utils/getDirtyFields';
import { IUser, IUserInputForm } from '@/types/IUser';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { UserRoles } from '@/constants/user-roles.enum';
import { zodName, zodEmail, zodPhone } from '@/utils/zod';
import { enumToArray, getUserRoleText } from '@/utils/enum';
import FormProvider from '@/components/hook-form/form-provider';
import { useCreateUserAPI, useUpdateUserAPI } from '@/api/useUserApi';
import { InputSelect, InputTextField, InputPhoneNumber } from '@/components/hook-form';

interface Props {
  onSuccess?: () => void;
  user?: IUser;
}

const scheme = z.object({
  name: zodName(),
  email: zodEmail(),
  phone: zodPhone().nullish(),
});

export default function UserForm({ user, onSuccess }: Props) {
  const { mutateAsync: createUser, isPending: createLoading } = useCreateUserAPI();
  const { mutateAsync: updateUser, isPending: updateLoading } = useUpdateUserAPI();

  const defaultValues = useMemo<IUserInputForm>(
    () => ({
      name: user?.name || null,
      email: user?.email || null,
      phone: user?.phone || null,
      role: user?.role || UserRoles.user,
      isActive: user?.isActive || true,
    }),
    [user]
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const {
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const isDirty = methods.formState.isDirty;

  const onSubmit = handleSubmit(async (data: IUserInputForm) => {
    if (user) {
      const partialData = getDirtyFields(dirtyFields, data);
      updateUser(
        { id: user.id, data: partialData },
        {
          onSuccess() {
            enqueueSnackbar('Kullanıcı güncellendi');
            onSuccess?.();
          },
          onError(error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    } else {
      createUser(data, {
        onSuccess() {
          enqueueSnackbar('Kullanıcı eklendi');
          onSuccess?.();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent>
        <Stack spacing={2} width={1} px={1}>
          <InputTextField name="name" label="Ad Soyad" />
          <InputTextField name="email" label="E-Mail" />
          <InputPhoneNumber defaultCountry="TR" name="phone" label="Telefon Numarası" />
          <InputSelect name="role" label="Rol">
            {enumToArray(UserRoles).map((x) => (
              <MenuItem key={x} value={x}>
                {getUserRoleText(x)}
              </MenuItem>
            ))}
          </InputSelect>
          <InputSelect name="isActive" label="Sistem Erişimi">
            <MenuItem value={false as any}>Kapalı</MenuItem>
            <MenuItem value={true as any}>Açık</MenuItem>
          </InputSelect>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton type="submit" variant="contained" disabled={!isDirty} loading={createLoading || updateLoading}>
          Kaydet
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

import { z } from 'zod';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { zodBaseString } from '@/utils/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import getDirtyFields from '@/utils/getDirtyFields';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { ICompany, ICompanyForm } from '@/types/ICompany';
import FormProvider, { InputTextField } from '@/components/hook-form';
import { useCreateCompanyApi, useUpdateCompanyApi } from '@/api/useCompanyApi';
import InputStringAutocomplete from '@/components/autocomplete/input-string-autocomplete';

interface ICompanyEditModalProps {
  company?: ICompany;
  onSuccessForm: (data: ICompany) => void;
}

const scheme = z.object({
  email: z.string().email('Geçerli değer girin').nullish(),
  name: zodBaseString.trim().min(1, 'Bu alan boş olamaz'),
  sector: zodBaseString.trim().min(1, 'Bu alan boş olamaz'),
});

export default function CompanyForm({ company, onSuccessForm }: ICompanyEditModalProps) {
  const defaultValues: ICompanyForm = useMemo(
    () => ({
      name: company?.name || null,
      email: company?.email || null,
      location: company?.location || null,
      sector: company?.sector || null,
      description: company?.description || null,
      address: company?.address || null,
    }),
    [company]
  );

  const methods = useForm<ICompanyForm>({
    defaultValues,
    resolver: zodResolver(scheme, {}, { raw: true }),
  });

  const {
    reset,
    handleSubmit,
    formState: { dirtyFields },
  } = methods;

  const { mutateAsync: addCompany, isPending: loadingCreate } = useCreateCompanyApi();
  const { mutateAsync: updateCompany, isPending: loadingUpdate } = useUpdateCompanyApi();
  const isDirty = methods.formState.isDirty;

  const onSubmit = handleSubmit(async (data: ICompanyForm) => {
    if (company) {
      const updatedData = getDirtyFields(dirtyFields, data);
      updateCompany(
        { id: company.id, data: updatedData },
        {
          onSuccess(data) {
            enqueueSnackbar('Firma güncellendi');
            onSuccessForm(data);
          },
          onError(error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    } else {
      addCompany(data, {
        onSuccess(data) {
          enqueueSnackbar('Firma eklendi');
          onSuccessForm(data);
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box display="grid" gridTemplateColumns={'repeat(2, 1fr)'} gap={2}>
            <InputTextField fullWidth name="name" label="Firma Adı" />
            <InputStringAutocomplete name="sector" label="Sektör" url="sector" />
            <InputTextField fullWidth name="email" label="Yetkili E-Posta" />
            <InputStringAutocomplete name="location" url="location" label="Lokasyon" />
          </Box>

          <Box sx={{ my: 2 }} display="grid" gridTemplateColumns={'repeat(2, 1fr)'} gap={2}>
            <InputTextField fullWidth multiline name="address" label="Adres" rows={3} />
            <InputTextField fullWidth multiline name="description" label="Açıklama" rows={3} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={!isDirty}
            sx={{ alignSelf: 'end' }}
            loading={loadingCreate || loadingUpdate}
          >
            Kaydet
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </>
  );
}

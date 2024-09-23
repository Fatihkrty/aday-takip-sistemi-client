import { z } from 'zod';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import Divider from '@mui/material/Divider';
import { fDate } from '@/utils/format-time';
import { ICompany } from '@/types/ICompany';
import ListItem from '@mui/material/ListItem';
import { useBoolean } from '@/hooks/useBoolean';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputDatePicker } from '@/components/hook-form';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ConfirmModal from '@/components/modal/confirm-modal';
import FormProvider from '@/components/hook-form/form-provider';
import UploadPaper from '@/components/upload-paper/upload-paper';
import { useCreateCompanyContractApi, useDeleteCompanyContractApi } from '@/api/useCompanyApi';

interface Props {
  company?: ICompany;
  onSuccessForm: (data: ICompany) => void;
}

const scheme = z.object({
  startDate: z.coerce.date({ invalid_type_error: 'Geçerli değer girin' }),
  endDate: z.coerce.date({ invalid_type_error: 'Geçerli değer girin' }),
  file: z.instanceof(File, { message: 'Dosya seçilmedi' }),
});

const defaultValues = {
  startDate: new Date(),
  endDate: new Date(),
  file: null,
};

export default function CompanyContractForm({ company, onSuccessForm }: Props) {
  const deleteModal = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [contractId, setContractId] = useState<number>();
  const methods = useForm({ defaultValues, resolver: zodResolver(scheme, {}, { raw: true }) });
  const selectedFile = methods.watch('file');
  const { mutateAsync: createContract, isPending: createLoading } = useCreateCompanyContractApi();
  const { mutateAsync: deleteContract, isPending: deleteLoading } = useDeleteCompanyContractApi();

  const onSubmit = methods.handleSubmit((data) => {
    if (!company) return;
    const formData = new FormData();

    formData.append('startDate', data.startDate as any);
    formData.append('endDate', data.endDate as any);
    formData.append('file', data.file as any);

    createContract(
      { companyId: company.id, data: formData },
      {
        onSuccess(data) {
          enqueueSnackbar('Sözleşme yüklendi');
          methods.reset(defaultValues);
          if (fileRef.current) {
            fileRef.current.value = '';
          }
          onSuccessForm(data);
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      }
    );
  });

  const handleDeleteContract = () => {
    if (contractId) {
      deleteContract(contractId, {
        onSuccess(data) {
          enqueueSnackbar('Sözleşme silindi');
          deleteModal.setFalse();
          onSuccessForm(data);
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          deleteModal.setFalse();
        },
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent sx={{ pt: 0 }}>
        {company?.contracts.length ? (
          <List sx={{ maxHeight: 280, overflow: 'auto' }}>
            {company.contracts.map((value) => {
              return (
                <ListItem
                  key={value.id}
                  disablePadding
                  secondaryAction={
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setContractId(value.id);
                        deleteModal.setTrue();
                      }}
                      color="error"
                      variant="outlined"
                    >
                      Sil
                    </Button>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      window.open(`${process.env.NEXT_PUBLIC_API_URL}/upload/${value.uri}`, '_blank');
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${fDate(value.startDate)} / ${fDate(value.endDate)}`}
                      secondary={`Eklenme tarihi: ${fDate(value.createdAt)}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Alert sx={{ justifyContent: 'center', p: 6, fontSize: 16 }}>Henüz sözleşme eklenmemiş</Alert>
        )}

        <Divider>
          <Typography sx={{ my: 2 }} variant="inherit" fontSize={18}>
            Yeni Ekle
          </Typography>
        </Divider>

        <Stack spacing={2} direction="row">
          <InputDatePicker fullWidth label="Başlangıç Tarihi" name="startDate" />
          <InputDatePicker fullWidth label="Başlangıç Tarihi" name="endDate" />
        </Stack>

        <UploadPaper
          error={!!methods.formState.errors.file}
          helperText={methods.formState.errors.file?.message}
          sx={{ mt: 2 }}
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          <Typography variant="h6">Dosya seç</Typography>
          <Typography variant="body2">*Sadece pdf dosyaları yüklenebilir</Typography>
          <Typography variant="caption">{(selectedFile as any)?.name || ''}</Typography>
        </UploadPaper>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton loading={createLoading} type="submit" variant="contained">
          Kaydet
        </LoadingButton>
      </DialogActions>

      <ConfirmModal
        open={deleteModal.value}
        loading={deleteLoading}
        acceptLabel="Sil"
        cancelLabel="İptal"
        onAccept={handleDeleteContract}
        onCancel={deleteModal.setFalse}
        title="Sözleşme sil"
        reverseColor
      >
        <Typography>Sözleşmeyi silmek istiyor musunuz ?</Typography>
      </ConfirmModal>

      <input
        hidden
        type="file"
        ref={fileRef}
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.length ? e.target.files[0] : null;
          methods.setValue('file', file as any, { shouldValidate: true });
        }}
      />
    </FormProvider>
  );
}

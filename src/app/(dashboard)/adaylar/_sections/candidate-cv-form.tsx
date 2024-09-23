import { z } from 'zod';
import Link from 'next/link';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import Divider from '@mui/material/Divider';
import { zodBaseString } from '@/utils/zod';
import ListItem from '@mui/material/ListItem';
import { ICandidate } from '@/types/ICandidate';
import Delete from '@mui/icons-material/Delete';
import { useBoolean } from '@/hooks/useBoolean';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import ListItemText from '@mui/material/ListItemText';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { InputTextField } from '@/components/hook-form';
import ListItemButton from '@mui/material/ListItemButton';
import ConfirmModal from '@/components/modal/confirm-modal';
import FormProvider from '@/components/hook-form/form-provider';
import UploadPaper from '@/components/upload-paper/upload-paper';
import { useDeleteCandidateCv, useCreateCandidateCvApi } from '@/api/useCandidateApi';

interface ICandidateCvForm {
  link: string | null;
  file: File | null;
}

const scheme = z.object({
  link: zodBaseString.trim().url('Geçerli değer girin').nullish(),
  file: z.instanceof(File, { message: 'Dosya girilmedi' }).nullish(),
});

interface Props {
  candidate?: ICandidate;
  onCreateSuccess?: (data: ICandidate) => void;
  onRemoveSuccess?: (data: ICandidate) => void;
}

const defaultValues = {
  link: null,
  file: null,
};

export default function CandidateCvForm({ candidate, onCreateSuccess, onRemoveSuccess }: Props) {
  const deleteModal = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const [cvId, setCvId] = useState<number>();
  const fileRef = useRef<HTMLInputElement>(null);
  const methods = useForm<ICandidateCvForm>({
    defaultValues,
    resolver: zodResolver(scheme),
  });

  const { mutateAsync: deleteCandidateCv, isPending: deleteCvLoading } = useDeleteCandidateCv();
  const { mutateAsync: createCandidateCv, isPending: createCvLoading } = useCreateCandidateCvApi();

  const selectedFile = methods.watch('file');

  const handleDeleteCv = () => {
    if (cvId) {
      deleteCandidateCv(cvId, {
        onSuccess(data) {
          enqueueSnackbar('Cv silindi');
          onRemoveSuccess?.(data);
          deleteModal.setFalse();
        },
        onError(error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  };

  const onSubmit = methods.handleSubmit(async (data) => {
    const formData = new FormData();

    if (data.file) {
      formData.append('file', data.file);
    }

    if (data.link) {
      formData.append('link', data.link);
    }

    if (!data.file && !data.link) {
      return;
    }

    if (candidate) {
      createCandidateCv(
        {
          id: candidate.id,
          data: formData,
        },
        {
          onSuccess(data) {
            enqueueSnackbar('Cv eklendi');
            onCreateSuccess?.(data);
            methods.reset(defaultValues);
            if (fileRef.current) {
              fileRef.current.value = '';
            }
          },
          onError(error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent>
        <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={1}>
          Link Listesi
        </Typography>

        {!candidate?.cvs.length ? (
          <Alert sx={{ p: 6, justifyContent: 'center', fontSize: 16 }}>Cv listesi boş</Alert>
        ) : (
          <List disablePadding>
            {candidate.cvs.map((x) => (
              <ListItem
                disablePadding
                key={x.id}
                secondaryAction={
                  <Button
                    onClick={() => {
                      setCvId(x.id);
                      deleteModal.setTrue();
                    }}
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                  >
                    Sil
                  </Button>
                }
              >
                <ListItemButton
                  LinkComponent={Link}
                  href={`${process.env.NEXT_PUBLIC_API_URL}/upload/${x.uri}`}
                  target="_blank"
                >
                  <ListItemText sx={{ mr: 8 }}>
                    <Typography noWrap>{x.uri}</Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        <Typography variant="h6" fontWeight="bold" color="text.secondary" mt={2} mb={1}>
          Yeni Ekle
        </Typography>

        <InputTextField name="link" label="Cv Linki" fullWidth />

        <Divider flexItem variant="fullWidth" sx={{ fontSize: 18, fontWeight: 'bold', my: 2 }}>
          Veya Dosya Yükle
        </Divider>

        <UploadPaper
          sx={{ mt: 2 }}
          error={!!methods.formState.errors.file}
          helperText={methods.formState.errors.file?.message}
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          <Typography variant="h6">Dosya seç</Typography>
          <Typography variant="caption">{selectedFile?.name || ''}</Typography>
        </UploadPaper>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton loading={createCvLoading} type="submit" variant="contained">
          Kaydet
        </LoadingButton>
      </DialogActions>

      <ConfirmModal
        reverseColor
        title="Cv Sil"
        acceptLabel="Sil"
        cancelLabel="İptal"
        open={deleteModal.value}
        onAccept={handleDeleteCv}
        loading={deleteCvLoading}
        onCancel={deleteModal.setFalse}
      >
        <Typography>
          Cv dosyasını silmek istiyor musunuz? <br /> <strong>Bu işlem geri alınamaz.</strong>
        </Typography>
      </ConfirmModal>

      <input
        hidden
        type="file"
        ref={fileRef}
        // accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.length ? e.target.files[0] : null;
          methods.setValue('file', file, { shouldValidate: true });
        }}
      />
    </FormProvider>
  );
}

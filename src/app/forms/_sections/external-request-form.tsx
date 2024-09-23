import { z } from 'zod';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import Divider from '@mui/material/Divider';
import { zodBaseString } from '@/utils/zod';
import MenuItem from '@mui/material/MenuItem';
import { WorkDay } from '@/constants/work-day';
import Delete from '@mui/icons-material/Delete';
import { WorkType } from '@/constants/work-type';
import { Gender } from '@/constants/gender.enum';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import { SideRights } from '@/constants/side-rights';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useForm, useFieldArray } from 'react-hook-form';
import { MilitaryService } from '@/constants/military-service';
import FormProvider from '@/components/hook-form/form-provider';
import { IExternalRequestForm } from '@/types/IExternalRequest';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import InputTimePicker from '@/components/hook-form/input-time-picker';
import { createExternalRequestApi } from '@/api/useExternalRequestApi';
import InputStringAutocomplete from '@/components/autocomplete/input-string-autocomplete';
import {
  enumToArray,
  getGenderText,
  getWorkDayText,
  getWorkTypeText,
  getSideRightsText,
  getMilitaryServiceText,
} from '@/utils/enum';
import {
  InputRate,
  InputSelect,
  InputCheckbox,
  InputTextField,
  InputNumberField,
  InputPhoneNumber,
  InputMultiCheckbox,
} from '@/components/hook-form';

interface Props {
  code: string;
}

export default function ExternalRequestForm({ code }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const methods = useForm<IExternalRequestForm>({ defaultValues, resolver: zodResolver(schema, {}, { raw: true }) });

  const onSubmit = methods.handleSubmit(async (data) => {
    if ((data as any).gender === 'none') {
      data.gender = null;
    }

    if ((data as any).militaryService === 'none') {
      data.militaryService = null;
    }

    setLoading(true);

    try {
      await createExternalRequestApi(code, data);
      enqueueSnackbar('Talep formu gönderildi');
      setIsCompleted(true);
    } catch (error) {
      enqueueSnackbar((error as any).message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  if (isCompleted) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert sx={{ p: 10, fontSize: 18, justifyContent: 'center' }}>Talep formu gönderildi</Alert>
      </Box>
    );
  }

  return (
    <Card elevation={5}>
      <CardContent>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogContent>
            <Box
              sx={{
                gap: 2,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" fontSize={18} mb={-1} sx={{ gridColumn: 'span 2' }}>
                Firma Temsilcisi
              </Typography>

              <InputTextField name="advisorName" label="Ad Soyad" />
              <InputTextField name="advisorTitle" label="Ünvan" />
              <InputTextField name="advisorEmail" label="Email" />
              <InputPhoneNumber name="advisorPhone" defaultCountry="TR" label="Telefon" />

              <Typography variant="subtitle1" fontWeight="bold" fontSize={18} mb={-1} sx={{ gridColumn: 'span 2' }}>
                İlan ve Talep Bilgileri
              </Typography>

              <InputStringAutocomplete name="position" url="position" label="Pozisyon" />
              <InputTextField name="department" label="Departman" />
              <Box>
                <InputNumberField fullWidth name="salary" label="Maaş" />
                <InputCheckbox name="prim" label="Prim" />
              </Box>
              <InputNumberField name="workerReqCount" label="Talep Edilen Personel Sayısı" />
              <InputTimePicker sx={{ width: 1 }} name="workHourStart" label="İş Başlangıç Saati" />
              <InputTimePicker sx={{ width: 1 }} name="workHourEnd" label="İş Bitiş Saati" />
              <InputSelect name="gender" label="Cinsiyet">
                <MenuItem value="none">
                  <em>Farketmez..</em>
                </MenuItem>
                {enumToArray(Gender).map((x) => (
                  <MenuItem key={x} value={x}>
                    {getGenderText(x)}
                  </MenuItem>
                ))}
              </InputSelect>
              <InputSelect defaultValue="none" name="militaryService" label="Askerlik">
                <MenuItem value="none">
                  <em>Farketmez..</em>
                </MenuItem>
                {enumToArray(MilitaryService).map((x) => (
                  <MenuItem key={x} value={x}>
                    {getMilitaryServiceText(x)}
                  </MenuItem>
                ))}
              </InputSelect>
              <InputTextField name="requiredQualifications" multiline rows={3} label="Aranan Nitelikler" />
              <InputTextField name="jobDescription" multiline rows={3} label="Görev Tanımı" />

              <RequestLanguages />

              <Divider sx={{ gridColumn: 'span 2' }} />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" fontSize={18} sx={{ gridColumn: 'span 2' }}>
                  Çalışma Şekli
                </Typography>
                <InputMultiCheckbox
                  row
                  name="workType"
                  options={enumToArray(WorkType).map((x) => ({ label: getWorkTypeText(x), value: x }))}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" fontSize={18} sx={{ gridColumn: 'span 2' }}>
                  Çalışma Günleri
                </Typography>

                <InputMultiCheckbox
                  row
                  name="workDays"
                  options={enumToArray(WorkDay).map((x) => ({ label: getWorkDayText(x), value: x }))}
                />
              </Box>

              <Divider sx={{ gridColumn: 'span 2' }} />

              <Box gridColumn="span 2">
                <Typography variant="subtitle1" fontWeight="bold" fontSize={18} sx={{ gridColumn: 'span 2' }}>
                  Yan Haklar
                </Typography>

                <InputMultiCheckbox
                  row
                  name="sideRights"
                  options={enumToArray(SideRights).map((x) => ({ label: getSideRightsText(x), value: x }))}
                />
              </Box>

              <Divider sx={{ gridColumn: 'span 2' }} />

              <InputTextField
                sx={{ gridColumn: 'span 2' }}
                name="description"
                multiline
                rows={3}
                label="Ek açıklamalar"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center' }}>
            <LoadingButton loading={loading} type="submit" variant="contained">
              Kaydet
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

function RequestLanguages() {
  const languages = useFieldArray({ name: 'languages' });

  return (
    <>
      <Box display="flex" gap={1} alignItems="center" sx={{ gridColumn: 'span 2' }}>
        <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
          Yabancı Diller
        </Typography>
        <IconButton
          onClick={() => {
            languages.append({ name: null, rate: 0 });
          }}
        >
          <AddCircleOutline color="primary" />
        </IconButton>
      </Box>

      {languages.fields.map((x, i) => (
        <Box key={x.id} gridColumn={'span 2'}>
          <Stack direction="row" alignItems="start">
            <InputTextField
              fullWidth
              size="small"
              label="Dil"
              variant="filled"
              sx={{ maxWidth: 1 }}
              name={`languages[${i}].name`}
            />
            <InputRate ml={2} name={`languages[${i}].rate`} />
            <Box flexGrow={1} />
            <IconButton color="error" onClick={() => languages.remove(i)}>
              <Delete />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </>
  );
}

const defaultValues: IExternalRequestForm = {
  advisorEmail: null,
  advisorPhone: null,
  advisorName: null,
  advisorTitle: null,
  department: null,
  requiredQualifications: null,
  description: null,
  gender: 'none' as any,
  jobDescription: null,
  languages: [],
  militaryService: 'none' as any,
  position: null,
  prim: false,
  salary: 0,
  sideRights: [],
  workDays: [],
  workerReqCount: 0,
  workHourEnd: '17:00',
  workHourStart: '08:00',
  workType: [],
};

const schema = z.object({
  department: zodBaseString.nullish(),
  workerReqCount: z.coerce.number().min(1, 'Bu alan en az 1 olabilir'),
  jobDescription: zodBaseString.nullish(),
  requiredQualifications: zodBaseString.nullish(),
  description: zodBaseString.nullish(),
  salary: z.coerce.number({ invalid_type_error: 'Bu alan gerekli' }).nonnegative('Bu alan en az 0 olabilir').nullish(),
  prim: z.coerce.boolean().nullish(),
  workType: z.nativeEnum(WorkType).array().nullish(),
  workDays: z.nativeEnum(WorkDay).array().nullish(),
  workHourStart: zodBaseString.nullish(),
  workHourEnd: zodBaseString.nullish(),
  advisorName: zodBaseString.nullish(),
  advisorPhone: zodBaseString.nullish(),
  advisorTitle: zodBaseString.nullish(),
  advisorEmail: zodBaseString.nullish(),
  sideRights: z.nativeEnum(SideRights).array().nullish(),
  gender: zodBaseString.nullish(),
  militaryService: zodBaseString.nullish(),
  languages: z
    .object({
      name: zodBaseString.min(1, 'Bu alan gerekli'),
      rate: z.coerce
        .number({ invalid_type_error: 'Bu alan gerekli' })
        .min(1, 'Bu alan en az 1 olabilir')
        .max(5, 'Bu alan en fazla 5 olabilir'),
    })
    .array(),
  position: zodBaseString,
});

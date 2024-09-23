import { z } from 'zod';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { diff } from 'deep-object-diff';
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
import { SideRights } from '@/constants/side-rights';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useForm, useFieldArray } from 'react-hook-form';
import { IRequest, IRequestForm } from '@/types/IRequest';
import { MilitaryService } from '@/constants/military-service';
import FormProvider from '@/components/hook-form/form-provider';
import { CompanyWorkType } from '@/constants/company-work-type';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import InputTimePicker from '@/components/hook-form/input-time-picker';
import { useCreateRequestApi, useUpdateRequestApi } from '@/api/useRequestApi';
import InputStringAutocomplete from '@/components/autocomplete/input-string-autocomplete';
import InputObjectAutocomplete from '@/components/autocomplete/input-object-autocomplete';
import {
  enumToArray,
  getGenderText,
  getWorkDayText,
  getWorkTypeText,
  getSideRightsText,
  getMilitaryServiceText,
  getCompanyWorkTypeText,
} from '@/utils/enum';
import {
  InputRate,
  InputSelect,
  InputCheckbox,
  InputTextField,
  InputRadioGroup,
  InputNumberField,
  InputPhoneNumber,
  InputMultiCheckbox,
} from '@/components/hook-form';

interface Props {
  request?: IRequest;
  onSuccess?: () => void;
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

export default function RequestForm({ request, onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(() => getDefaultValues(request), [request]);
  const methods = useForm<IRequestForm>({ defaultValues, resolver: zodResolver(schema, {}, { raw: true }) });

  const { mutateAsync: createRequest } = useCreateRequestApi();
  const { mutateAsync: updateRequest } = useUpdateRequestApi();

  const onSubmit = methods.handleSubmit(async (data) => {
    if ((data as any).gender === 'none') {
      data.gender = null;
    }

    if ((data as any).militaryService === 'none') {
      data.militaryService = null;
    }

    if (request) {
      const updatedData: Partial<IRequestForm> = diff(methods.formState.defaultValues!, data);

      if (updatedData.company !== undefined) {
        (updatedData as any).companyId = updatedData.company?.id || null;
        delete updatedData.company;
      }

      if (updatedData.user !== undefined) {
        (updatedData as any).userId = updatedData.user?.id || null;
        delete updatedData.user;
      }

      if (updatedData.workDays) {
        updatedData.workDays = data.workDays;
      }

      if (updatedData.sideRights) {
        updatedData.sideRights = data.sideRights;
      }

      if (updatedData.workType) {
        updatedData.workType = data.workType;
      }

      if (updatedData.languages) {
        updatedData.languages = data.languages;
      }

      if (updatedData.gender === request.gender) {
        delete updatedData.gender;
      }

      if (updatedData.militaryService === request.militaryService) {
        delete updatedData.militaryService;
      }

      if (request.isExternal) {
        (updatedData as any).isExternal = false;
      }

      updateRequest(
        {
          id: request.id,
          data: updatedData,
        },
        {
          onSuccess() {
            enqueueSnackbar('Talep güncellendi');
            onSuccess?.();
          },
          onError(error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    } else {
      (data as any).companyId = data.company?.id;
      (data as any).userId = data.user?.id;

      delete (data as any).company;
      delete (data as any).user;

      createRequest(data, {
        onSuccess() {
          enqueueSnackbar('Talep oluşturuldu');
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
        <Box
          sx={{
            gap: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" fontSize={18} my={-1} sx={{ gridColumn: 'span 2' }}>
            Firma Bilgileri
          </Typography>

          <Box sx={{ gridColumn: 'span 2' }}>
            <InputObjectAutocomplete name="company" label="Firma Adı" url="company" />
          </Box>

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

          <Box gridColumn="span 2">
            <Typography variant="subtitle1" fontWeight="bold" fontSize={18} sx={{ gridColumn: 'span 2' }}>
              Firma Çalışma Şekli
            </Typography>
            <InputRadioGroup
              name="companyWorkType"
              options={enumToArray(CompanyWorkType).map((x) => ({ label: getCompanyWorkTypeText(x), value: x }))}
            />
          </Box>

          <Box sx={{ gridColumn: 'span 2' }}>
            <InputObjectAutocomplete name="user" url="user" label="Danışman Görevlendir" />
          </Box>

          <InputTextField sx={{ gridColumn: 'span 2' }} name="description" multiline rows={3} label="Ek açıklamalar" />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton type="submit" variant="contained">
          Kaydet
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

function getDefaultValues(request?: IRequest): IRequestForm {
  return {
    advisorEmail: request?.advisorEmail || null,
    advisorPhone: request?.advisorPhone || null,
    advisorName: request?.advisorName || null,
    advisorTitle: request?.advisorTitle || null,
    company: request?.company || null,
    companyWorkType: request?.companyWorkType || null,
    department: request?.department || null,
    requiredQualifications: request?.requiredQualifications || null,
    description: request?.description || null,
    gender: request?.gender || ('none' as any),
    jobDescription: request?.jobDescription || null,
    languages: request?.languages || [],
    militaryService: request?.militaryService || ('none' as any),
    position: request?.position?.name || null,
    prim: request?.prim || false,
    salary: request?.salary || 0,
    sideRights: request?.sideRights || [],
    user: request?.user || null,
    workDays: request?.workDays || [],
    workerReqCount: request?.workerReqCount || 0,
    workHourEnd: request?.workHourEnd || '17:00',
    workHourStart: request?.workHourStart || '08:00',
    workType: request?.workType || [],
  };
}

const schema = z.object({
  department: zodBaseString.nullish(),
  workerReqCount: z.coerce.number().min(1, 'Bu alan en az 1 olabilir'),
  jobDescription: zodBaseString.nullish(),
  requiredQualifications: zodBaseString.nullish(),
  description: zodBaseString.nullish(),
  salary: z.coerce.number({ invalid_type_error: 'Bu alan gerekli' }).nonnegative('Bu alan en az 0 olabilir').nullish(),
  prim: z.coerce.boolean().nullish(),
  workType: z.nativeEnum(WorkType).array().nullish(),
  companyWorkType: z.nativeEnum(CompanyWorkType).nullish(),
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
  company: z.object(
    {
      id: z.number({ invalid_type_error: 'Bu alan gerekli' }),
    },
    { invalid_type_error: 'Bu alan gerekli' }
  ),
  user: z
    .object(
      {
        id: z.number({ invalid_type_error: 'Bu alan gerekli' }),
      },
      { invalid_type_error: 'Bu alan gerekli' }
    )
    .nullish(),
});

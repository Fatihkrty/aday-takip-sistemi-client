import { z } from 'zod';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Delete from '@mui/icons-material/Delete';
import { Gender } from '@/constants/gender.enum';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import getDirtyFields from '@/utils/getDirtyFields';
import { zodResolver } from '@hookform/resolvers/zod';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useForm, useFieldArray } from 'react-hook-form';
import { Compatibility } from '@/constants/compatibility';
import { MilitaryService } from '@/constants/military-service';
import { ICandidate, ICandidateForm } from '@/types/ICandidate';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import { zodName, zodEmail, zodPhone, zodBaseString } from '@/utils/zod';
import { useCreateCandidateApi, useUpdateCandidateApi } from '@/api/useCandidateApi';
import { enumToArray, getCompatibilityText, getMilitaryServiceText } from '@/utils/enum';
import InputStringAutocomplete from '@/components/autocomplete/input-string-autocomplete';
import FormProvider, {
  InputRate,
  InputSelect,
  InputTextField,
  InputRadioGroup,
  InputPhoneNumber,
  InputNumberField,
} from '@/components/hook-form';

interface Props {
  candidate?: ICandidate;
}

export default function CandidateForm({ candidate }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createCandidate, isPending: createLoading } = useCreateCandidateApi();
  const { mutateAsync: updateCandidate, isPending: updateLoading } = useUpdateCandidateApi();
  const defaultValues = useMemo(() => getDefaultValues(candidate), [candidate]);

  const methods = useForm<ICandidateForm>({
    defaultValues,
    resolver: zodResolver(schema, {}, { raw: true }),
  });

  const languages = useFieldArray({
    name: 'languages',
    control: methods.control,
  });

  const refererences = useFieldArray({
    name: 'references',
    control: methods.control,
  });

  const onSubmit = methods.handleSubmit(async (data: ICandidateForm) => {
    if (candidate) {
      const updatedValues = getDirtyFields(methods.formState.dirtyFields, data);

      const newData = {
        ...updatedValues,
        positions: data.positions,
        languages: data.languages,
        references: data.references,
      };

      updateCandidate(
        {
          id: candidate.id,
          data: newData,
        },
        {
          onSuccess() {
            enqueueSnackbar('Aday güncellendi');
          },
          onError(error) {
            console.log(error);
            enqueueSnackbar(error.message, { variant: 'error' });
          },
        }
      );
    } else {
      createCandidate(data, {
        onSuccess() {
          enqueueSnackbar('Aday eklendi');
        },
        onError(error) {
          console.log(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        },
      });
    }
  });

  const gender = methods.watch('gender');

  useEffect(() => {
    if (gender === Gender.female) {
      methods.setValue('militaryService', MilitaryService.exempt, { shouldValidate: true, shouldDirty: true });
    }
  }, [gender, methods]);

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogContent>
        <Box
          sx={{
            gap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" fontSize={18} my={-1} sx={{ gridColumn: 'span 2' }}>
            Kişisel Bilgiler
          </Typography>

          <InputTextField fullWidth name="name" label="Ad Soyad" helperText="* Zorunlu alan" />

          <InputSelect name="gender" label="Cinsiyet" helperText="* Zorunlu Alan">
            <MenuItem value={Gender.male}>Erkek</MenuItem>
            <MenuItem value={Gender.female}>Kadın</MenuItem>
          </InputSelect>

          <InputTextField name="email" fullWidth label="E-Posta" />

          <InputPhoneNumber preferredCountries={['TR']} name="phone" label="Telefon Numarası" defaultCountry="TR" />

          <InputStringAutocomplete name="location" url="location" label="Lokasyon" />

          <InputSelect
            label="Askerlik"
            name="militaryService"
            helperText="* Zorunlu alan"
            disabled={gender === Gender.female}
          >
            {enumToArray(MilitaryService).map((x) => (
              <MenuItem key={x} value={x}>
                {getMilitaryServiceText(x)}
              </MenuItem>
            ))}
          </InputSelect>

          <Typography variant="subtitle1" fontWeight="bold" fontSize={18} mb={-1} sx={{ gridColumn: 'span 2' }}>
            Çalışma Koşulları
          </Typography>

          <InputStringAutocomplete name="positions" url="position" multiple label="Pozisyonlar" />

          <InputNumberField name="salary" label="Net Maaş Beklentisi" fullWidth />

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
              Uyum
            </Typography>
            <InputRadioGroup
              name="compatibility"
              options={enumToArray(Compatibility).map((x) => ({ label: getCompatibilityText(x), value: x }))}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
              Değerli Cv
            </Typography>
            <InputRate name="rate" />
          </Box>

          <Box sx={{ gridColumn: 'span 2' }}>
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
                Diller (Varsa)
              </Typography>

              <IconButton color="primary" sx={{ ml: 1 }} onClick={() => languages.append({ name: null, rate: 0 })}>
                <AddCircleOutlined />
              </IconButton>
            </Stack>
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

          <Box sx={{ gridColumn: 'span 2' }}>
            <Stack direction="row" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold" fontSize={18}>
                Referanslar (Varsa)
              </Typography>
              <IconButton
                color="primary"
                sx={{ ml: 1 }}
                onClick={() => refererences.append({ name: null, phone: null })}
              >
                <AddCircleOutlined />
              </IconButton>
            </Stack>
          </Box>

          {refererences.fields.map((x, i) => (
            <Box key={x.id} gridColumn={'span 2'}>
              <Stack direction="row" spacing={2} alignItems="start">
                <InputTextField variant="filled" fullWidth name={`references[${i}].name`} label="Ad Soyad" />
                <InputPhoneNumber
                  defaultCountry="TR"
                  variant="filled"
                  fullWidth
                  name={`references[${i}].phone`}
                  label="Telefon"
                />

                <IconButton color="error" onClick={() => refererences.remove(i)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Box>
          ))}

          <InputTextField
            fullWidth
            sx={{ gridColumn: 'span 2' }}
            multiline
            name="note"
            label="Aday hakkında kısa notlar"
            rows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton loading={createLoading || updateLoading} type="submit" color="primary" variant="contained">
          Kaydet
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

function getDefaultValues(candidate?: ICandidate): ICandidateForm {
  if (candidate) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cvs, createdAt, deletedAt, ...other } = candidate;
    return {
      ...other,
      references: candidate.references.map((x) => ({ name: x.name, phone: x.phone })),
      languages: candidate.languages.map((x) => ({ name: x.name, rate: x.rate })),
      positions: candidate.positions.map((x) => x.position.name),
    };
  }

  return {
    name: null,
    email: null,
    phone: null,
    note: null,
    location: null,
    gender: null,
    salary: 0,
    rate: null,
    compatibility: null,
    militaryService: null,
    positions: [],
    languages: [],
    references: [],
  };
}

const schema = z.object({
  name: zodName(),
  email: zodEmail().nullish(),
  phone: zodPhone().nullish(),
  note: zodBaseString.nullish(),
  positions: zodBaseString.array(),
  location: zodBaseString.nullish(),
  rate: z.coerce.number().nullish(),
  salary: z.coerce.number().nullish(),
  compatibility: zodBaseString.nullish(),
  gender: z.nativeEnum(Gender, { invalid_type_error: 'Geçerli değer girin' }),
  militaryService: z.nativeEnum(MilitaryService, { invalid_type_error: 'Geçerli değer girin' }),
  languages: z
    .object({
      name: zodName(),
      rate: z.coerce.number().min(1, 'Bu alan en az 1 olabilir'),
    })
    .array(),
  references: z
    .object({
      name: zodName(),
      phone: zodPhone().nullish(),
    })
    .array(),
});

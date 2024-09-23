import Chip from '@mui/material/Chip';
import { debounce } from '@mui/material';
import { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import type API_ENDPOINTS from '@/api/API_ENDPOINTS';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { getStringAutocompleteApi } from '@/api/useAutocomplete';

interface Props {
  name: string;
  helperText?: string;
  multiple?: boolean;
  label?: string;
  url: keyof typeof API_ENDPOINTS.autocomplete.search;
}

export default function InputStringAutocomplete({ name, url, multiple, label, helperText }: Props) {
  const { control } = useFormContext();
  const [options, setOptions] = useState<string[]>([]);

  const fetchData = useMemo(
    () =>
      debounce(async (input: string) => {
        if (input === '') return;
        try {
          const resp = await getStringAutocompleteApi({ url, search: input });
          setOptions(resp);
        } catch (error) {
          console.log(error);
        }
      }, 400),
    [url]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          freeSolo
          fullWidth
          value={field.value === '' ? null : field.value}
          onChange={(_, value) => field.onChange(value)}
          multiple={multiple}
          onInputChange={(_, value) => {
            fetchData(value);
            if (!multiple) {
              field.onChange(value);
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />)
          }
          noOptionsText="Öneri yok"
          loadingText="Yükleniyor..."
          renderInput={(params) => (
            <TextField error={!!error} helperText={error ? error.message : helperText} {...params} label={label} />
          )}
          options={options}
        />
      )}
    />
  );
}

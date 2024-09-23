import Chip from '@mui/material/Chip';
import { debounce } from '@mui/material';
import { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import type API_ENDPOINTS from '@/api/API_ENDPOINTS';
import Autocomplete from '@mui/material/Autocomplete';
import { IAutocomplete } from '@/types/IAutocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { getObjectAutocompleteApi } from '@/api/useAutocomplete';

interface Props {
  name: string;
  helperText?: string;
  label?: string;
  url: keyof typeof API_ENDPOINTS.autocomplete.search;
}

export default function InputObjectAutocomplete({ name, url, label, helperText }: Props) {
  const { control } = useFormContext();
  const [options, setOptions] = useState<IAutocomplete[]>([]);

  const fetchData = useMemo(
    () =>
      debounce(async (input: string) => {
        if (input === '') return;
        try {
          const resp = await getObjectAutocompleteApi({ url, search: input });
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
          fullWidth
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') {
              fetchData(value);
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.name} />)
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
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

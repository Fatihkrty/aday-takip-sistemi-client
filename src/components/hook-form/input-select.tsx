// react
import { ReactNode } from 'react';
// @mui
import Select from '@mui/material/Select';
import { FormControlProps } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
// form
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props extends FormControlProps {
  name: string;
  label?: string;
  native?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  children: ReactNode;
}

export default function InputSelect({ name, native, children, label, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <InputLabel id={name}>{label}</InputLabel>}
          <Select {...field} fullWidth native={native} value={field.value || ''} id={`select-${name}`} label={label}>
            {children}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

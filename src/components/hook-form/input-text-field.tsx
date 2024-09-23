import { Controller, useFormContext } from 'react-hook-form';
// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function InputTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          error={!!error}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

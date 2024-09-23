import { TextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

type Props = TextFieldProps & {
  name: string;
};

export default function InputNumberField({ name, helperText, ...other }: Omit<Props, 'type'>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="number"
          onKeyDown={(evt) => {
            ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault();
          }}
          value={field.value ?? ''}
          onChange={(event) => {
            const value = Number(event.target.value);
            field.onChange(isNaN(value) ? '' : value);
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

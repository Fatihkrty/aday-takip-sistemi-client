import { ReactNode } from 'react';
import Rating from '@mui/material/Rating';
import Box, { BoxProps } from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';

interface Props extends BoxProps {
  name: string;
  helperText?: string;
  label?: ReactNode;
  disabled?: boolean;
}

export default function InputRate({ name, disabled, label, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Box display="flex" flexDirection="column" {...other}>
            {label}
            <Rating readOnly={disabled} size="large" {...field} value={field.value ? parseInt(field.value) : 0} />
            <FormHelperText error={!!error}>{error?.message || helperText}</FormHelperText>
          </Box>
        );
      }}
    />
  );
}

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiTelInput, MuiTelInputProps } from 'mui-tel-input';

type Props = MuiTelInputProps & {
  name: string;
};

export default function InputPhoneNumber({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: fieldRef, ...fieldProps }, fieldState: { error } }) => (
        <MuiTelInput
          {...fieldProps}
          inputRef={fieldRef}
          value={fieldProps.value ?? ''}
          onChange={(value) => fieldProps.onChange(value === '' ? null : value)}
          helperText={error ? error?.message : helperText}
          error={!!error}
          {...other}
        />
      )}
    />
  );
}

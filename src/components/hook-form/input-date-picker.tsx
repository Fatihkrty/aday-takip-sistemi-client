import dayjs from 'dayjs';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function InputDatePicker({ name, label, disabled, fullWidth }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDatePicker
          {...field}
          value={dayjs(field.value)}
          disabled={disabled}
          label={label}
          orientation="portrait"
          slotProps={{
            textField: {
              fullWidth,
              error: !!error,
              helperText: error?.message,
            },
          }}
          onChange={(newValue) => field.onChange(newValue?.toDate())}
          localeText={{
            cancelButtonLabel: 'İptal',
            okButtonLabel: 'Tamam',
            toolbarTitle: 'Tarih Seçin',
            nextMonth: 'Sonraki Ay',
            previousMonth: 'Önceki Ay',
          }}
        />
      )}
    />
  );
}

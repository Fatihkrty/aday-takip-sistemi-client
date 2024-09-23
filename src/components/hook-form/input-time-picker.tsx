import dayjs, { Dayjs } from 'dayjs';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';

type Props = TimePickerProps<Dayjs> & {
  name: string;
  helperText?: string;
};

function splitTimeToDayjs(value: string) {
  if (!value) return null;

  const [hour, minute] = value.split(':');

  const date = new Date();
  date.setHours(hour as any);
  date.setMinutes(minute as any);

  return dayjs(date);
}

export default function InputTimePicker({ name, helperText, ...other }: Props) {
  const { control, setError, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <TimePicker
            onError={(err) => {
              if (err) {
                setError(name, { message: 'Geçerli değer girin' });
              } else {
                clearErrors(name);
              }
            }}
            value={splitTimeToDayjs(field.value)}
            onChange={(val) => {
              if (val) {
                const hour = val.hour().toLocaleString('tr-TR', { minimumIntegerDigits: 2 });
                const minute = val.minute().toLocaleString('tr-TR', { minimumIntegerDigits: 2 });
                field.onChange(`${hour}:${minute}`);
              } else {
                field.onChange(val);
              }
            }}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}

import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Props {
  name: string;
  helperText?: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

export default function InputRadioGroup({ name, disabled, options, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <RadioGroup {...field} row {...other}>
            {options.map((option) => (
              <FormControlLabel
                disabled={disabled}
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={<Typography>{option.label}</Typography>}
              />
            ))}
          </RadioGroup>
          <FormHelperText error={!!error} sx={{ px: 2 }}>
            {error?.message || helperText}
          </FormHelperText>
        </div>
      )}
    />
  );
}

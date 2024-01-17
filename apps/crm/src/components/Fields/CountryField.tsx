import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COUNTRIES } from '@cipher-health/utils';
import { useActiveForm, useFormError } from '@cipher-health/form';
import { Controller } from 'react-hook-form';

type CountrySelectProps = {
  name: string
}

export default function CountryField(props: CountrySelectProps) {

  const { form } = useActiveForm()
  const { name } = props

  const error = useFormError(name)

  return <Controller
    name={name}
    control={form.control}
    render={({ field: { value, ref, ...rest }, formState }) => {
      return <Autocomplete
        {...rest}
        onChange={(_, data) => rest.onChange(data?.code)}
        options={COUNTRIES}
        defaultValue={COUNTRIES.find((c) => c.code === formState?.defaultValues?.country)}
        autoHighlight
        fullWidth
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            />
            {option.label} ({option.code}) +{option.phone}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            margin='none'
            required
            error={error?.isInvalid}
            helperText={error?.errorText}
            name='country'
            inputRef={(e) => ref({ ...e, focus: () => e?.focus() })}
            label="Votre pays"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    }}
  />
}

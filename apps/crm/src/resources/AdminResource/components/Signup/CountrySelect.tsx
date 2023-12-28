import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Control, Controller } from 'react-hook-form';
import { COUNTRIES } from '@cipher-health/utils';

const CountrySelect = ({ control, getError }: { control: Control<any>, getError: (key: any) => { helperText?: string, error?: boolean } }) => {
  return (
    <Controller
      name="country"
      control={control}
      render={({ field: { value, ...rest } }) => {
        return <Autocomplete
          {...rest}
          onChange={(_, data) => rest.onChange(data?.code)}
          options={COUNTRIES}
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
              {...getError('country')}
              margin='none'
              inputRef={(e) => rest.ref({ ...e, focus: () => e?.focus() })}
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
  );
}

export default CountrySelect;
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { COUNTRIES } from '@cipher-health/utils';

const CountrySelect = () => {
  return <Autocomplete
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
        margin='none'
        required
        name='country'
        label="Votre pays"
        inputProps={{
          ...params.inputProps,
          autoComplete: 'new-password', // disable autocomplete and autofill
        }}
      />
    )}
  />
}

export default CountrySelect;
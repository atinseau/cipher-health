import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RadioGroup from "../../../../../../components/RadioGroup";
import ProfileContainer from "./ProfileContainer";

export default function ProfileInformation() {
  return <ProfileContainer>
    <form>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
        <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
        <TextField required label="Votre nom" />
        <TextField required label="Votre prénom" />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
          <DatePicker
            sx={{ flex: 1 }}
            label="Date de naissance"
          />
          <TextField sx={{ flex: 1 }} label="Lieu de naissance" />
        </Box>
        <RadioGroup
          sx={{ mt: "20px" }}
          label="Vous êtes ?"
          required
          defaultValue="MALE"
          radioGroupProps={{
            sx: {
              display: 'flex',
              flexDirection: 'row',
            }
          }}
          options={[{ label: 'Homme', value: 'MALE' }, { label: 'Femme', value: 'FEMALE' }]}
          id="gender"
        />
      </Box>
    </form>
  </ProfileContainer>
}
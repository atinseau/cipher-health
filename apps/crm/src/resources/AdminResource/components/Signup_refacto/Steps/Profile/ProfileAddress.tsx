import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProfileContainer from "./ProfileContainer";
import CountrySelect from "../../../../../../components/CountrySelect";


export default function ProfileAddress() {
  return <ProfileContainer>
    <form>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
        <Typography mb={"5px"} variant="body1" color="GrayText">Vos coordonnées</Typography>
        <TextField label="Votre adresse" />
        <TextField label="Votre code postal" />
        <TextField label="Votre ville" />
        <CountrySelect />
      </Box>
    </form>
  </ProfileContainer>
}





import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Container } from "../../Signup/SignupContainer";
import CountrySelect from "../../../../../components/CountrySelect";


export default function Registration() {

  const isSubmitting = false;

  return <Container>
    <form>
      <Box mb={"30px"}>
        <Typography variant="h6">Bienvenue !</Typography>
        <Typography variant="body2" color="GrayText">Pour créer votre compte, veuillez renseigner les champs suivant.</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
          <TextField required sx={{ mb: "10px" }} margin="none" label="Votre email"  />
          <Box sx={{ display: 'flex', gap: "6px" }}>
            <CountrySelect />
            <TextField required fullWidth margin="none" label="Votre téléphone" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Sécurité</Typography>
          <TextField required sx={{ mb: "10px" }} margin="none" label="Votre mdp" id="password" type="password"  />
          <TextField required margin="none" label="Confirmer mdp" id="phone" type="password"  />
        </Box>
      </Box>

      <Button type="submit" sx={{ mt: "40px", width: "100%" }} variant="contained">
        {isSubmitting ? <CircularProgress size="24px" sx={{ color: "black" }} /> : 'Créer mon compte'}
      </Button>
    </form>
  </Container>
}
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Box from "@mui/material/Box";
import { useState } from "react";
import { Container } from "../../Signup/SignupContainer";
import Code from "../../../../../components/TwoFaCode";


export default function Verifying() {

  const [code, setCode] = useState<string>()

  return <Container>
    <Box component="form" sx={{ pt: "10px" }}>

      <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
        <LockPersonIcon fontSize={"large"} sx={{ mb: "10px" }} />
        <Typography variant="h6">Confirmer votre compte</Typography>
        <Typography variant="body2" color="GrayText">
          Nous allons vous envoyer un sms au numéro de téléphone que vous avez renseigné.
          Merci de bien vouloir renseigner le code que vous allez recevoir.
        </Typography>
      </Box>

      <Code />

      <Box sx={{ mt: "20px" }}>
        <Typography variant="body2" color="GrayText">
          Votre code est valide pendant 5 minutes.
        </Typography>
        <Typography variant="body2" color="GrayText">
          Code non reçu ? <a href="#">Renvoyer</a>
        </Typography>
      </Box>

      <Button sx={{ mt: "25px", width: "100%" }} variant="contained">
        Confirmer
      </Button>
    </Box>
  </Container>
}
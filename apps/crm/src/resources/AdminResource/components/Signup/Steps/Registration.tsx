import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@cipher-health/utils/schemas";
import { useCallback } from "react";
import TextField from "@/components/Fields/TextField";
import { authentificator } from "@/auth";
import CountryField from "@/components/Fields/CountryField";
import { CustomPageContainer } from "@/components/CustomPage";

const defaultValues = {
  "email": "arthurtinseau@live.fr",
  "password": "06112001..Arttsn",
  "confirmPassword": "06112001..Arttsn",
  "phone": "0782887672",
  "country": "FR"
}

export default function Registration() {

  const { handleSubmit, setErrors, formRef } = useFormStep({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    const [_, error] = await authentificator.signup(data)
    if (error instanceof Error) {
      throw error
    }
    if (error) {
      setErrors(error)
      return false
    }
    return true
  }, [])

  const isSubmitting = false;

  return <CustomPageContainer>
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Box mb={"30px"}>
        <Typography variant="h6">Bienvenue !</Typography>
        <Typography variant="body2" color="GrayText">Pour créer votre compte, veuillez renseigner les champs suivant.</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
          <TextField name="email" required sx={{ mb: "10px" }} margin="none" label="Votre email" />
          <Box sx={{ display: 'flex', gap: "6px" }}>
            <CountryField name="country" />
            <TextField name="phone" required fullWidth margin="none" label="Votre téléphone" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Sécurité</Typography>
          <TextField name="password" required sx={{ mb: "10px" }} margin="none" label="Votre mdp" id="password" type="password" />
          <TextField name="confirmPassword" required margin="none" label="Confirmer mdp" id="phone" type="password" />
        </Box>
      </Box>

      <Button type="submit" sx={{ mt: "40px", width: "100%" }} variant="contained">
        {isSubmitting ? <CircularProgress size="24px" sx={{ color: "black" }} /> : 'Créer mon compte'}
      </Button>
    </form>
  </CustomPageContainer>
}
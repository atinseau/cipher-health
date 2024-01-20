import { CustomPageContainer } from "@/components/CustomPage";
import LockIcon from '@mui/icons-material/Lock';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@/components/Fields/TextField";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import Button from "@mui/material/Button";
import { useNotify } from "react-admin";
import { authentificator } from "@/auth";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export default function SigninLogin() {

  const notify = useNotify()

  const { handleSubmit } = useFormStep({
    resolver: zodResolver(signinSchema)
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    await authentificator.login({
      email: data.email,
      password: data.password
    })
    notify('Un code de vérification vous a été envoyé par sms', {
      type: 'success',
    })
    return true
  }, [])

  return <CustomPageContainer>
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: '20px' }}>
      <LockIcon sx={{ alignSelf: 'center', mb: '10px' }} fontSize="large" />
      <Typography variant="h6">Connexion</Typography>
      <Typography variant="body2" color="GrayText">
        Veuillez vous connecter pour accéder à votre compte
      </Typography>
    </Box>

    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        fullWidth
        autoComplete="email"
        label="Entrez votre email"
        type="email"
        name="email"
      />
      <TextField
        fullWidth
        autoComplete="password"
        label="Entrez votre mot de passe"
        type="password"
        name="password"
      />
      <Button type="submit" sx={{ mt: "30px" }} variant="contained">Se connecter</Button>
    </Box>
  </CustomPageContainer>
}
import { CustomPageContainer } from "@/components/CustomPage";
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@/components/Fields/TextField";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import Button from "@mui/material/Button";
import CodeField from "@/components/Fields/CodeField";
import { authentificator } from "@/auth";

const signinVerifyingSchema = z.object({
  code: z.string().min(6).max(6),
})

export default function SigninVerifying() {

  const { handleSubmit } = useFormStep({
    resolver: zodResolver(signinVerifyingSchema)
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    await authentificator.loginCallback(data.code)
    return true
  }, [])

  return <CustomPageContainer>
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: '20px' }}>
      <PhonelinkLockIcon sx={{ alignSelf: 'center', mb: '10px' }} fontSize="large" />
      <Typography variant="h6">Vérification</Typography>
      <Typography variant="body2" color="GrayText">
        Veuillez entrer le code que vous avez reçu par sms
      </Typography>
    </Box>

    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handleSubmit(onSubmit)}>
      <CodeField />
      <Button type="submit" sx={{ mt: "30px" }} variant="contained">Se connecter</Button>
    </Box>
  </CustomPageContainer>
}
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Box from "@mui/material/Box";
import { useCallback } from "react";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CodeField from "@/components/Fields/CodeField";
import { useMount } from "@cipher-health/utils/react";
import { useAtom } from "jotai";
import { signupInfoAtom } from "../signupStore";
import { authentificator } from "@/auth";
import { useNotify } from "react-admin";
import { codeSent, expiredCodeError } from "@/lib/errors";
import { CustomPageContainer } from "@/components/CustomPage";

const twoFaSchema = z.object({
  code: z.string().min(6).max(6),
})

export default function Verifying() {

  const [signupInfo] = useAtom(signupInfoAtom)
  const notify = useNotify()

  const { handleSubmit } = useFormStep({
    resolver: zodResolver(twoFaSchema)
  })

  useMount(async () => {
    console.log(signupInfo)
    // Send sms if not sent
    if (signupInfo?.status === 'USER_NOT_VERIFIED' && !signupInfo.codeSent) {
      await authentificator.sendVerificationCode()
      notify(codeSent)
    }
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    const [res, error] = await authentificator.verify(data.code)
    if (error) {
      notify(expiredCodeError)
      return false
    }
    return true
  }, [])

  return <CustomPageContainer>
    <Box component="form" sx={{ pt: "10px" }} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
        <LockPersonIcon fontSize={"large"} sx={{ mb: "10px" }} />
        <Typography variant="h6">Confirmer votre compte</Typography>
        <Typography variant="body2" color="GrayText">
          Nous allons vous envoyer un sms au numéro de téléphone que vous avez renseigné.
          Merci de bien vouloir renseigner le code que vous allez recevoir.
        </Typography>
      </Box>
      <CodeField />
      <Box sx={{ mt: "20px" }}>
        <Typography variant="body2" color="GrayText">
          Votre code est valide pendant 5 minutes.
        </Typography>
        <Typography variant="body2" color="GrayText">
          Code non reçu ? <a href="#">Renvoyer</a>
        </Typography>
      </Box>
      {/* TODO: impl resend code manually */}
      <Button type="submit" sx={{ mt: "25px", width: "100%" }} variant="contained">
        Confirmer
      </Button>
    </Box>
  </CustomPageContainer>
}
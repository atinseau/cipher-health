import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProfileContainer from "./ProfileContainer";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { z } from "zod";
import TextField from "@/components/Fields/TextField";
import CountryField from "@/components/Fields/CountryField";
import { authentificator } from "@/auth";

const profileAddressSchema = z.object({
  address: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(1),
  country: z.string(),
})

const defaultValues = {
  "address": "25 Boulevard de la somme",
  "zipCode": "75017",
  "city": "Paris",
  "country": "FR"
}

export default function ProfileAddress() {

  const { handleSubmit, formRef, setErrors } = useFormStep({
    resolver: zodResolver(profileAddressSchema),
    defaultValues
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data, mergedData) => {
    const payload = {
      ...mergedData,
      ...data
    }

    const [_, error] = await authentificator.createProfile(payload)
    if (error instanceof Error) {
      throw error
    }
    if (error) {
      setErrors(error)
      return false
    }
    return true
  }, [])

  return <ProfileContainer>
    <Box onSubmit={handleSubmit(onSubmit)} ref={formRef} component="form" sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
      <Typography mb={"5px"} variant="body1" color="GrayText">Vos coordonnées</Typography>
      <TextField name="address" label="Votre adresse" />
      <TextField name="zipCode" label="Votre code postal" />
      <TextField name="city" label="Votre ville" />
      <CountryField name="country" />
    </Box>
  </ProfileContainer>
}


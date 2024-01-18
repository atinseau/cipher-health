import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProfileContainer from "./ProfileContainer";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMinimalMajorBirthDate } from "@cipher-health/utils";
import { useCallback } from "react";
import TextField from "@/components/Fields/TextField";
import DateField from "@/components/Fields/DateField";
import RadioField from "@/components/Fields/RadioField";


const informationSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE']),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate(), {
    message: "Vous devez être majeur"
  }),
  birthPlace: z.string().min(1).optional(),
  birthName: z.string().optional(),
})

const defaultValues = {
  "gender": "MALE",
  "firstName": "Arthur",
  "lastName": "Tinseau",
  "birthDate": "2001-06-10T22:00:00.000Z",
  "birthPlace": "Paris"
}

export default function ProfileInformation() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(informationSchema),
    defaultValues
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    return true
  }, [])

  return <ProfileContainer>
    <Box component="form" ref={formRef} onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
      <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
      <TextField name="lastName" required label="Votre nom" />
      <TextField name="firstName" required label="Votre prénom" />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
        <DateField name="birthDate" />
        <TextField name="birthPlace" sx={{ flex: 1 }} label="Lieu de naissance" />
      </Box>
      <RadioField
        name="gender"
        label="Vous êtes ?"
        defaultValue="MALE"
        options={[
          { label: 'Homme', value: 'MALE' },
          { label: 'Femme', value: 'FEMALE' }
        ]}
      />
    </Box>
  </ProfileContainer>
}
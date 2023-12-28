import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RadioGroup from "../../../../components/RadioGroup";

import { Container } from "./SignupContainer";
import { forwardRef, lazy, useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod'
import { getMinimalMajorBirthDate } from "@cipher-health/utils";

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const profileInformationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate()),
  birthPlace: z.string(),
})

const ProfileInformation = forwardRef<HTMLFormElement>((_, ref) => {

  const { register, handleSubmit, formState } = useForm<z.infer<typeof profileInformationSchema>>({
    resolver: zodResolver(profileInformationSchema)
  })

  const onSubmit = useCallback((body: z.infer<typeof profileInformationSchema>) => {
    console.log(body)
  }, [])

  const getError = useCallback((key: keyof z.infer<typeof profileInformationSchema>) => {
    let error = formState.errors[key]

    return {
      error: !!error,
      helperText: error?.message
    }
  }, [formState])

  return <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
      <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
      <TextField label="Votre nom" {...getError('firstName')} {...register('firstName')} />
      <TextField label="Votre prénom" {...getError('lastName')} {...register('lastName')} />

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
        {/* <DatePicker sx={{ "input": { py: "12px" } }} /> */}
        <TextField label="Lieu de naissance" />
      </Box>

      <RadioGroup
        sx={{ mt: "20px" }}
        label="Vous êtes ?"
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
})

const ProfileAddress = () => {
  return <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
    <Typography mb={"5px"} variant="body1" color="GrayText">Adresse</Typography>
    <TextField label="Votre adresse" />
    <TextField label="Votre code postal" />
    <TextField label="Votre ville" />
    <TextField label="Votre pays" />
  </Box>
}

const steps = [ProfileInformation, ProfileAddress]

export default function Profile() {

  const [step, setStep] = useState(0)

  const Component = steps[step]

  const formRef = useRef<HTMLFormElement>(null)

  return <Container sx={{ minWidth: 400 }}>
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
      <Typography variant="h6">Création de votre profile</Typography>
      <Typography variant="body2" color="GrayText">
        Pour terminer la configuration de votre compte, veuillez renseigner les champs suivant.
      </Typography>

      <Component ref={formRef} />

      <Box sx={{ mt: "15px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="GrayText">
          {step + 1}/{steps.length}
        </Typography>
        <Button onClick={() => formRef.current?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        )} variant="contained">
          Suivant
        </Button>
      </Box>
    {/* </LocalizationProvider> */}
  </Container>
}
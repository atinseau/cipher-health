import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import RadioGroup from "../../../../components/RadioGroup";

import { Container } from "./SignupContainer";
import { forwardRef, lazy, useCallback, useDebugValue, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from 'zod'
import { getMinimalMajorBirthDate } from "@cipher-health/utils";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from "dayjs";
import CountrySelect from "./CountrySelect";
import { useClient } from "@cipher-health/sdk/react";

type StepProps = {
  updateMergedData: (data: any) => void
  defaultValues?: any
  errors?: Record<string, string>
  setErrors?: (errors: Record<string, string>) => void
}

const profileInformationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().min(1),
  birthDate: z.coerce.date().max(getMinimalMajorBirthDate(), {
    message: 'Vous devez avoir au moins 18 ans'
  }),
  gender: z.enum(['MALE', 'FEMALE']),
  birthPlace: z.string(),
})

const profileAddressSchema = z.object({
  address: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(1),
  country: z.string(),
})



const ProfileInformation = forwardRef<HTMLFormElement, StepProps>(({ updateMergedData, defaultValues, errors, setErrors }, ref) => {
  const { register, handleSubmit, watch, formState, control } = useForm<z.infer<typeof profileInformationSchema>>({
    resolver: zodResolver(profileInformationSchema),
    mode: 'onChange',
    defaultValues
  })

  const onSubmit = useCallback((body: z.infer<typeof profileInformationSchema>) => {
    updateMergedData(body)
  }, [])

  const getError = useCallback((key: keyof z.infer<typeof profileInformationSchema>) => {
    let error = formState.errors[key]

    if (errors[key]) {
      return {
        error: true,
        helperText: errors[key]
      }
    }

    return {
      error: !!error,
      helperText: error?.message
    }
  }, [formState])

  // If server returns validation errors
  // we clear them on the next input change
  useEffect(() => {
    const subscription = watch(() => {
      if (Object.keys(errors).length > 0) {
        setErrors({})
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [errors, watch])

  return <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
      <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
      <TextField required label="Votre nom" {...getError('firstName')} {...register('firstName')} />
      <TextField required label="Votre prénom" {...getError('lastName')} {...register('lastName')} />

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: "10px" }}>
        <Controller
          name="birthDate"
          control={control}
          render={({ field: { value, ref, ...rest }, formState }) => <DatePicker
            sx={{ flex: 1 }}
            {...rest}
            defaultValue={formState?.defaultValues?.birthDate && dayjs(formState?.defaultValues?.birthDate)}
            inputRef={(e) => e && ref({ ...e, focus: () => e?.focus() })}
            label="Date de naissance"
            slotProps={{ textField: { ...getError('birthDate') } }}
            onChange={(date: Dayjs) => rest.onChange(date.toDate())}
          />}
        />
        <TextField sx={{ flex: 1 }} label="Lieu de naissance" {...register('birthPlace')} />
      </Box>

      <Controller
        control={control}
        name="gender"
        render={({ field: { value, ref, ...rest }, formState }) => <RadioGroup
          {...getError('gender')}
          sx={{ mt: "20px" }}
          label="Vous êtes ?"
          onChange={(e) => rest.onChange((e.target as HTMLInputElement).value)}
          required
          defaultValue={formState?.defaultValues?.gender}
          radioGroupProps={{
            sx: {
              display: 'flex',
              flexDirection: 'row',
            }
          }}
          options={[{ label: 'Homme', value: 'MALE' }, { label: 'Femme', value: 'FEMALE' }]}
          id="gender"
        />}
      />
    </Box>
  </form>
})

const ProfileAddress = forwardRef<HTMLFormElement, StepProps>(({ updateMergedData, defaultValues, errors, setErrors }, ref) => {

  const { register, watch, handleSubmit, formState, control } = useForm<z.infer<typeof profileAddressSchema>>({
    resolver: zodResolver(profileAddressSchema),
    mode: 'onChange',
    defaultValues
  })

  const onSubmit = useCallback((body: z.infer<typeof profileAddressSchema>) => {
    updateMergedData(body)
  }, [])

  const getError = useCallback((key: keyof z.infer<typeof profileAddressSchema>) => {
    let error = formState.errors[key]

    if (errors[key]) {
      return {
        error: true,
        helperText: errors[key]
      }
    }

    return {
      error: !!error,
      helperText: error?.message
    }
  }, [formState])

  // If server returns validation errors
  // we clear them on the next input change
  useEffect(() => {
    const subscription = watch(() => {
      if (Object.keys(errors).length > 0) {
        setErrors({})
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [errors, watch])

  return <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: "30px" }}>
      <Typography mb={"5px"} variant="body1" color="GrayText">Vos coordonnées</Typography>
      <TextField label="Votre adresse" {...getError('address')} {...register('address')} />
      <TextField label="Votre code postal" {...getError('zipCode')} {...register('zipCode')} />
      <TextField label="Votre ville" {...getError('city')} {...register('city')} />
      <CountrySelect getError={getError} control={control} />
    </Box>
  </form>
})

const steps = [
  {
    id: 'profileInformation',
    component: ProfileInformation,
    defaultValues: {
      // "firstName": "Arthur",
      "lastName": "Tinseau",
      "birthDate": new Date("1985-12-27T23:00:00.000Z"),
      "gender": "MALE",
      "birthPlace": "Blois"
    }
  },
  {
    id: 'profileAddress',
    component: ProfileAddress,
    defaultValues: {
      "address": "25 boulevard de la somme",
      "zipCode": "75017",
      "city": "Paris",
      "country": "FR"
    }
  }
]

export default function Profile({ stwt }: { stwt: string }) {

  const client = useClient()

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // We need to initialize the mergedData with the defaultValues of each steps
  // Very useful on dev mode when we want to go to the last step without filling the form
  const [mergedData, setMergedData] = useState<Record<string, any>>(steps.reduce((acc, s) => ({
    ...acc,
    ...(s.defaultValues ? { [s.id]: s.defaultValues } : {})
  }), {}))

  const currentStep = steps[step]

  const Component = currentStep.component
  const formRef = useRef<HTMLFormElement>(null)

  // Guard
  const disableNextStep = useRef(false)
  const disableSubmission = useRef(false)
  const userInteracted = useRef(false)

  const computedDefaultValues = useMemo(() => {
    return mergedData[currentStep.id] || currentStep?.defaultValues || {}
  }, [step, mergedData])

  // This function is called in the step for getting back the data
  // from the form and merge it with the other data from the other steps associated with the formId
  const updateMergedData = useCallback((formId: string, data: any) => {
    setMergedData((prev) => ({
      ...prev,
      [formId]: data
    }))
  }, [])

  const onSubmit = async () => {

    const mergedBody = Object.values(mergedData).reduce((acc, data) => ({
      ...acc,
      ...data
    }), {})

    const [_, error] = await client.post('/user/profile/create', {
      body: mergedBody,
      query: {
        stwt
      }
    })

    if (error && error.status === 422) {
      const validationErrors = error.data as Array<any>
      // One rerender with react batch updates
      validationErrors.forEach((error) => {
        setErrors((prev) => ({
          ...prev,
          [error.path[0]]: error.message
        }))
      })
      disableNextStep.current = true
      setStep(0) // workaround to force the user to go back to the first step
      return
    }
  }

  useEffect(() => {
    // To prevent auto submission on first render
    if (!userInteracted.current) {
      return
    }

    // check if all data are filled
    // We must only check if all data are filled when we are on the last step
    // If the user came from a step that is not the last one, we don't want to 
    // automatically submit the form due to "step" state update
    // so when the user click on the next button, we set the "disableSubmission" boolean to true
    // to prevent the form to be submitted automatically
    // and after this useEffect, we reset the "disableSubmission" boolean to false
    if (!disableSubmission.current && step === steps.length - 1 && Object.keys(mergedData).length === steps.length) {
      onSubmit()
      return
    }

    disableSubmission.current = false

    // - if the current step is filled on this render, go to the next step
    // - if the current step is not filled, stay on the current step
    // - "disableNextStep" is a boolean to prevent going to the next step
    // when the user click on the prev button because "step" is updated and react
    // trigger this useEffect but maybe the previous step is already filled so 
    // it will result by going to the next step (like a loop)
    if (!disableNextStep.current && mergedData[currentStep.id] && step < steps.length - 1) {
      disableSubmission.current = true
      setStep((prev) => prev + 1)
    }

    // reset the "disableNextStep" boolean
    // after we have checked if we can go to the next step
    disableNextStep.current = false
  }, [step, mergedData])

  // This function is called when the user click on the next button
  // is role is to dispatch the submit event forwarded by the step component
  // to submit a form step outside of the form
  const dispatchStepSubmit = useCallback(() => {
    userInteracted.current = true
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }, [])

  const prev = useCallback(() => {
    if (step === 0) {
      return
    }
    userInteracted.current = true
    disableNextStep.current = true
    setStep((prev) => prev - 1)
  }, [step])

  return <Container sx={{ minWidth: 400 }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h6">Création de votre profile</Typography>
      <Typography variant="body2" color="GrayText">
        Pour terminer la configuration de votre compte, veuillez renseigner les champs suivant.
      </Typography>

      <Component
        ref={formRef}
        updateMergedData={updateMergedData.bind(null, currentStep.id)}
        errors={errors}
        setErrors={setErrors}
        defaultValues={computedDefaultValues as any}
      />

      <Box sx={{ mt: "15px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="GrayText">
          {step + 1}/{steps.length}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          {step > 0 && <Button onClick={prev} variant="outlined">
            Précédent
          </Button>}

          <Button onClick={dispatchStepSubmit} variant="contained">
            {step === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </Box>

      </Box>
    </LocalizationProvider>
  </Container>
}
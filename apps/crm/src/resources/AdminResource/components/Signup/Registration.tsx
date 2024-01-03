


import TextField, { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from "react";

import { zodResolver } from '@hookform/resolvers/zod';

import z from 'zod';
import { useClient } from "@cipher-health/sdk/react";
import { useNavigate } from "react-router-dom";

import { useNotify } from "react-admin";
import CountrySelect from "./CountrySelect";
import { Container } from "./SignupContainer";
import { COUNTRIES } from "@cipher-health/utils";
import { invalidLinkError } from "../../../../lib/errors";

const defaultValues = {
  "email": "arthurtinseau@live.fr",
  "password": "06112001..Arttsn",
  "confirmPassword": "06112001..Arttsn",
  "phone": "0782887672"
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    // TODO: use all regex from utils to validate password
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?.!@$%^&*-]).{8,}$/, {
      message: 'Password is too weak, it should contain at least 8 characters, one uppercase, one lowercase, one number and one special character (#?!@$%.^&*-)'
    }),
  confirmPassword: z.string().min(1),
  phone: z.string().min(1), // TODO: add phone validation, enforce international phone numbers only (E.164)
  country: z.string().refine((country) => {
    return COUNTRIES.some((c) => c.code === country)
  }, {
    message: 'Invalid country'
  })
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export default function Registration({ stwt, checkProgress }: {
  stwt: string,
  checkProgress: () => void
}) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const notify = useNotify()
  const navigate = useNavigate()
  const client = useClient()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { handleSubmit, register, formState, watch, control } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

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

  const onSubmit = useCallback(async (body: z.infer<typeof signupSchema>) => {

    setIsSubmitting(true)
    const [res, error] = await client.post('/auth/signup', {
      body,
      query: {
        stwt
      }
    })

    setIsSubmitting(false)
    if (error && error.status === 422) {
      const validationErrors = error.data as Array<any>
      // One rerender with react batch updates
      validationErrors.forEach((error) => {
        setErrors((prev) => ({
          ...prev,
          [error.path[0]]: error.message
        }))
      })
      return
    } else if (error && error.status === 401) {
      notify(invalidLinkError)
      navigate('/login')
      return
    } else if (error) {
      console.error(error)
      notify(error.message, {
        type: 'error'
      })
      return
    }
    checkProgress()
  }, [])

  const getError = useCallback((key: keyof z.infer<typeof signupSchema>) => {
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
  }, [formState, errors])

  return <Container>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={"30px"}>
        <Typography variant="h6">Bienvenue !</Typography>
        <Typography variant="body2" color="GrayText">Pour créer votre compte, veuillez renseigner les champs suivant.</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Informations</Typography>
          <TextField required sx={{ mb: "10px" }} margin="none" label="Votre email" {...register('email')} {...getError('email')} />
          <Box sx={{ display: 'flex', gap: "6px" }}>
            <CountrySelect control={control} getError={getError} />
            <TextField required fullWidth margin="none" label="Votre téléphone" {...register('phone')} {...getError('phone')} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={"5px"} variant="body1" color="GrayText">Sécurité</Typography>
          <TextField required sx={{ mb: "10px" }} margin="none" label="Votre mdp" id="password" type="password" {...register('password')} {...getError('password')} />
          <TextField required margin="none" label="Confirmer mdp" id="phone" type="password" {...register('confirmPassword')} {...getError('confirmPassword')} />
        </Box>
      </Box>

      <Button type="submit" sx={{ mt: "40px", width: "100%" }} variant="contained">
        {isSubmitting ? <CircularProgress size="24px" sx={{ color: "black" }} /> : 'Créer mon compte'}
      </Button>
    </form>
  </Container>
}
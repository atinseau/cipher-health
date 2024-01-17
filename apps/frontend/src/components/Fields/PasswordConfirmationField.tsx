import { useWatch } from "react-hook-form"
import { useMemo } from "react"
import TextInput from "@/components/Inputs/TextInput"
import { RxCross1 } from "react-icons/rx"
import { FaCheck } from "react-icons/fa6"
import { useActiveForm, useFormError } from "@cipher-health/form"

type PasswordConfirmationFieldProps = {
  passwordPropertyName?: string
  confirmPasswordPropertyName?: string
}

export default function PasswordConfirmationField(props: PasswordConfirmationFieldProps) {

  const {
    passwordPropertyName = 'password',
    confirmPasswordPropertyName = 'confirmPassword'
  } = props

  const { form } = useActiveForm()
  const errors = useFormError(confirmPasswordPropertyName)

  const password = useWatch({
    control: form.control,
    name: passwordPropertyName
  })
  const confirmPassword = useWatch({
    control: form.control,
    name: confirmPasswordPropertyName
  })

  const isPasswordValid = useMemo(() => {
    if (!confirmPassword || !password) return false
    return password === confirmPassword
  }, [
    password,
    confirmPassword
  ])

  return <TextInput
    baseInputProps={{
      label: "Confirmez votre mot de passe"
    }}
    placeholder="Votre mot de passe"
    isRequired
    type="password"
    endContent={
      !isPasswordValid
        ? <RxCross1 className="text-danger" size={20} />
        : <FaCheck className="text-success" size={20} />
    }
    {...form.register('confirmPassword')}
    {...errors}
  />
}

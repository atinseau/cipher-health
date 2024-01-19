import PasswordInput, { PasswordInputProps } from "@/components/Inputs/PasswordInput";
import { useActiveForm, useFormError } from "@cipher-health/form";

type PasswordFieldProps = {
  name?: string
  passwordInputProps?: PasswordInputProps
}

export default function PasswordField(props: PasswordFieldProps) {

  const {
    name = 'password',
    passwordInputProps
  } = props

  const { form } = useActiveForm()
  const errors = useFormError(name)

  return <PasswordInput
    {...passwordInputProps}
    {...errors}
    {...form.register(name)}
  />
}
import PasswordInput from "@/components/Inputs/PasswordInput";
import useActiveForm from "../hooks/useActiveForm";
import useFormError from "../hooks/useFormError";

type PasswordFieldProps = {
  passwordPropertyName?: string
}

export default function PasswordField(props: PasswordFieldProps) {

  const {
    passwordPropertyName = 'password'
  } = props

  const { form } = useActiveForm()

  const errors = useFormError(passwordPropertyName)

  return <PasswordInput
    baseInputProps={{
      label: "Votre mot de passe :"
    }}
    placeholder="Votre mot de passe"
    enableStrength
    isRequired
    {...errors}
    {...form.register(passwordPropertyName)}
  />
}
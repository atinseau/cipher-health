import TextInput, { TextInputProps } from "@/components/Inputs/TextInput";
import { useActiveForm, useFormError } from "@cipher-health/form";

type TextFieldProps = {
  name: string
  textInputProps?: TextInputProps
}

export default function TextField(props: TextFieldProps) {

  const {
    name,
    textInputProps
  } = props

  const { form } = useActiveForm()
  const error = useFormError(name)

  return <TextInput
    {...textInputProps}
    {...error}
    {...form.register(name)}
  />
}
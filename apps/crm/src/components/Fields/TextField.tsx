import { useActiveForm, useFormError } from "@cipher-health/form"
import TextFieldMui, { TextFieldProps as TextFieldMuiProps } from "@mui/material/TextField";


type TextFieldProps = Omit<TextFieldMuiProps, 'name'> & {
  name: string
}

export default function TextField(props: TextFieldProps) {

  const {
    name,
    ...rest
  } = props

  const { form } = useActiveForm()
  const error = useFormError(name)

  return <TextFieldMui
    {...form.register(name)}
    {...rest}
    error={error?.isInvalid}
    helperText={error?.errorText}
  />
}
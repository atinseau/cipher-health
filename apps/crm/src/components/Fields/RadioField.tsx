import { useActiveForm, useFormError } from "@cipher-health/form";
import { Controller } from "react-hook-form";
import RadioGroup from "../RadioGroup";

type RadioFieldProps = {
  name: string
  label: string
  defaultValue: string
  options: {
    value: string;
    label: string;
  }[]
}

export default function RadioField(props: RadioFieldProps) {

  const { form } = useActiveForm()
  const { name, label, defaultValue, options } = props

  const error = useFormError(name)

  return <Controller
    control={form.control}
    name={name}
    render={({ field: { value, ref, ...rest }, formState }) => <RadioGroup
      sx={{ mt: "20px" }}
      label={label}
      error={error?.isInvalid}
      helperText={error?.errorText}
      onChange={(e) => rest.onChange((e.target as HTMLInputElement).value)}
      required
      defaultValue={formState.defaultValues?.[name] || defaultValue}
      radioGroupProps={{
        sx: {
          display: 'flex',
          flexDirection: 'row',
        }
      }}
      options={options}
      id={name}
    />}
  />
}
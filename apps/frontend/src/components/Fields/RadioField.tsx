import RadioInput, { RadioItem, RadioInputProps } from "@/components/Inputs/RadioInput";
import { useActiveForm, useFormError } from "@cipher-health/form";
import { Controller } from "react-hook-form";

type RadioFieldProps = {
  name: string
  items: RadioItem[]
  radioInputProps?: Omit<RadioInputProps, 'items'>
}

export default function RadioField(props: RadioFieldProps) {

  const { form } = useActiveForm()

  const error = useFormError(props.name)

  return <Controller
    control={form.control}
    name={props.name}
    render={({ field }) => <RadioInput
      {...props.radioInputProps}
      items={props.items}
      isInvalid={error?.isInvalid}
      errorMessage={error?.errorText}
      defaultValue={field.value}
      onChange={(item) => {
        field.onChange(item.value)
      }}
    />}
  />

}
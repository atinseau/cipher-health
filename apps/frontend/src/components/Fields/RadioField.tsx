import RadioInput, { RadioItem, RadioInputProps } from "@/components/Inputs/RadioInput";
import { useActiveForm } from "@cipher-health/form";
import { Controller } from "react-hook-form";

type RadioFieldProps = {
  name: string
  items: RadioItem[]
  radioInputProps?: Omit<RadioInputProps, 'items'>
}

export default function RadioField(props: RadioFieldProps) {

  const { form } = useActiveForm()

  // TODO: consume errors

  return <Controller
    control={form.control}
    name={props.name}
    render={({ field }) => <RadioInput
      {...props.radioInputProps}
      items={props.items}
      defaultValue={field.value}
      onChange={(item) => {
        field.onChange(item.value)
      }}
    />}
  />

}
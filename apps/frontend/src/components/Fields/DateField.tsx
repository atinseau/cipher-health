import DateInput, { DateInputProps } from "@/components/Inputs/DateInput"
import { useActiveForm, useFormError } from "@cipher-health/form"
import { Controller } from "react-hook-form"

type DateFieldProps = {
  name: string
  dateInputProps?: DateInputProps
}

export default function DateField(props: DateFieldProps) {

  const { form } = useActiveForm()
  const error = useFormError(props.name)

  return <Controller
    control={form.control}
    name={props.name}
    render={({ field }) => <DateInput
      {...props.dateInputProps}
      {...error}
      defaultValue={field.value && new Date(field.value)}
      onChange={(date) => field.onChange(date?.toISOString())}
    />}
  />
}
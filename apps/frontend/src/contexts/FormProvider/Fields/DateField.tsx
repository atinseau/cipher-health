import DateInput, { DateInputProps } from "@/components/Inputs/DateInput"
import useActiveForm from "../hooks/useActiveForm"
import { Controller } from "react-hook-form"
import useFormError from "../hooks/useFormError"

type DateFieldProps = {
  name: string
  dateInputProps?: DateInputProps
}

export default function DateField(props: DateFieldProps) {

  const { form } = useActiveForm()

  const errors = useFormError(props.name)

  return <Controller
    control={form.control}
    name={props.name}
    render={({ field }) => <DateInput
      {...props.dateInputProps}
      {...errors}
      defaultValue={field.value}
      onChange={field.onChange}
    />}
  />
}
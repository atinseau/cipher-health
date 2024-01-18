import { useActiveForm, useFormError } from "@cipher-health/form";
import { Controller } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

type DateFieldProps = {
  name: string
}

export default function DateField(props: DateFieldProps) {

  const { form } = useActiveForm()
  const { name } = props

  const error = useFormError(name)

  return <Controller
    name={name}
    control={form.control}
    render={({ field: { value, ref, ...rest }, formState }) => <DatePicker
      sx={{ flex: 1 }}
      {...rest}
      defaultValue={formState?.defaultValues?.birthDate && dayjs(formState?.defaultValues?.birthDate)}
      inputRef={(e) => e && ref({ ...e, focus: () => e?.focus() })}
      label="Date de naissance"
      slotProps={{
        textField: {
          error: error?.isInvalid,
          helperText: error?.errorText
        }
      }}
      onChange={(date) => {
        rest.onChange(date.toDate())
      }}
    />}
  />
}
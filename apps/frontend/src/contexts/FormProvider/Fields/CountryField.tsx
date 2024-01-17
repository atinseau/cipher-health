import { Controller } from "react-hook-form";
import useActiveForm from "../hooks/useActiveForm";
import { COUNTRIES } from "@cipher-health/utils";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import useFormError from "../hooks/useFormError";

type CountryFieldProps = {
  name: string
  selectProperty?: (item: { label: string, value: string }) => string
}

export default function CountryField(props: CountryFieldProps) {


  const { form } = useActiveForm()
  const errors = useFormError(props.name)

  return <Controller
    name={props.name}
    control={form.control}
    render={({ field }) => <AutocompleteInput
      items={COUNTRIES.map((country) => ({
        label: country.label,
        value: country.code
      }))}
      defaultValue={field.value}
      classNames={{
        content: "max-h-[150px]"
      }}
      onChange={(e) => {
        if (!e) {
          field.onChange(undefined)
          return
        }
        const value = props.selectProperty?.(e)
        field.onChange(value || e.value)
      }}
      placeholder="Rechercher un pays"
      textInputProps={{
        isRequired: true,
        baseInputProps: {
          label: "Votre pays :"
        },
        ...errors,
      }}
    />}
  />
}
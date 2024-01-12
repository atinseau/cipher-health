import { Controller } from "react-hook-form";
import useActiveForm from "../hooks/useActiveForm";
import { COUNTRIES } from "@cipher-health/utils";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import useFormError from "../hooks/useFormError";

type CountryFieldProps = {
  countryPropertyName?: string
}

export default function CountryField(props: CountryFieldProps) {

  const {
    countryPropertyName = 'country'
  } = props

  const { form } = useActiveForm()
  const errors = useFormError(countryPropertyName)

  return <Controller
    name={countryPropertyName}
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
      onChange={(e) => field.onChange(e)}
      placeholder="Votre pays"
      textInputProps={{
        isRequired: true,
        ...errors,
      }}
    />}
  />
} 
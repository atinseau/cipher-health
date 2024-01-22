import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "../../AuthFormContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import TextField from "@/components/Fields/TextField";
import CountryField from "@/components/Fields/CountryField";
import { addressSchema } from "@cipher-health/utils/schemas";

// const defaultValues = {
//   "address": "Loir et cher",
//   "zipCode": "75017",
//   "addressDetails": "Paris",
//   "city": "Paris",
//   "country": "France"
// }

export default function SignupAddress() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(addressSchema),
    // defaultValues,
  })

  const onSubmit: FormStepSubmitHandler = useCallback(async () => {
    return true
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField
        name="address"
        textInputProps={{
          baseInputProps: {
            label: "Adresse :"
          },
          isRequired: true,
          placeholder: "Numéro et rue"
        }}
      />
      <TextField
        name="addressDetails"
        textInputProps={{
          baseInputProps: {
            label: "Complément d’adresse :"
          },
          placeholder: "Bâtiment, étage, appartement, etc."
        }}
      />
      <div className="flex gap-6 flex-col sm:flex-row">
        <TextField
          name="zipCode"
          textInputProps={{
            isRequired: true,
            placeholder: "Code postal (requis, ex: 75000)",
          }}
        />
        <TextField
          name="city"
          textInputProps={{
            isRequired: true,
            placeholder: "Ville (requis)"
          }}
        />
      </div>

      <CountryField
        name="country"
        selectProperty={(item) => item.label}
        textInputProps={{
          isRequired: true,
          baseInputProps: {
            label: "Votre pays :"
          },
        }}
      />
    </form>

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthFormContainer>
}
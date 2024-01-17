import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "../../AuthFormContainer";
import { FormStepSubmitHandler, useFormStep } from "@/contexts/FormProvider/hooks/useFormStep";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";
import TextField from "@/contexts/FormProvider/Fields/TextField";
import CountryField from "@/contexts/FormProvider/Fields/CountryField";

const addressSchema = z.object({
  address: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/),
  addressDetails: z.string().min(1).optional(),
  city: z.string().min(1),
  country: z.string(),
})

const defaultValues = {
  "address": "Loir et cher",
  "zipCode": "75017",
  "addressDetails": "Paris",
  "city": "Paris",
  "country": "France"
}

export default function SignupAddress() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(addressSchema),
    defaultValues
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
      <div className="flex gap-6">
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
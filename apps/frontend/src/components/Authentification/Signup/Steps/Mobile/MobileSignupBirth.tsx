import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import InformationCard from "@/components/Card/InformationCard";
import DateField from "@/components/Fields/DateField";
import TextField from "@/components/Fields/TextField";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { useCallback } from "react";


export default function MobileSignupBirth() {

  const { handleSubmit, formRef } = useFormStep()

  const onSubmit: FormStepSubmitHandler = useCallback(async () => {
    return true
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
    as="form"
    containerProps={{
      ref: formRef,
      onSubmit: handleSubmit(onSubmit)
    }}
  >
    <DateField
      name="birthDate"
      dateInputProps={{
        baseInputProps: {
          label: "Date de naissance :"
        },
        placeholder: "Votre date de naissance",
        autoClose: true,
        isRequired: true
      }}
    />

    <TextField
      name="birthPlace"
      textInputProps={{
        baseInputProps: {
          label: "Lieu de naissance :"
        },
        placeholder: "Département, ville, pays",
        isRequired: true
      }}
    />

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthFormContainer>
}
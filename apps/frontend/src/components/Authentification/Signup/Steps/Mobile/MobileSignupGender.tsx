import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import InformationCard from "@/components/Card/InformationCard";
import RadioField from "@/components/Fields/RadioField";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { useCallback } from "react";



export default function MobileSignupGender() {

  
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
    <RadioField
      name="gender"
      items={[
        { label: "Un Homme", value: "MALE" },
        { label: "Une femme", value: "FEMALE" },
      ]}
      radioInputProps={{
        label: "Vous êtes :",
        subLabel: "La réglementation du système de santé français nous oblige à vous demander cette information.",
        isRequired: true,
        orientation: "horizontal"
      }}
    />

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthFormContainer>
}
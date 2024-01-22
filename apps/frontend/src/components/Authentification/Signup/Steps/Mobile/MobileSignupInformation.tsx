import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import InformationCard from "@/components/Card/InformationCard";
import TextField from "@/components/Fields/TextField";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { useCallback } from "react";



export default function MobileSignupInformation() {

  const { handleSubmit, formRef } = useFormStep()

  const onSubmit: FormStepSubmitHandler = useCallback(async () => {
    return true
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
    containerProps={{
      ref: formRef,
      onSubmit: handleSubmit(onSubmit)
    }}
  >
    <TextField
      name="firstName"
      textInputProps={{
        baseInputProps: {
          label: "Prénom :"
        },
        placeholder: "Votre prénom",
        isRequired: true
      }}
    />

    <TextField
      name="lastName"
      textInputProps={{
        baseInputProps: {
          label: "Nom :"
        },
        placeholder: "Votre nom",
        isRequired: true
      }}
    />

    <TextField
      name="birthName"
      textInputProps={{
        baseInputProps: {
          label: "Nom de naissance :"
        },
        placeholder: "Votre nom de naissance"
      }}
    />

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>

  </AuthFormContainer>
}
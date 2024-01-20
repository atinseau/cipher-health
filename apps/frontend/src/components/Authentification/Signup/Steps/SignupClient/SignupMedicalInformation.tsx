import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import TextField from "@/components/Fields/TextField";
import useCreateProfile from "@/contexts/AuthProvider/hooks/useCreateProfile";
import { FormStepSubmitHandler, useFormStep } from "@cipher-health/form";
import { clientMedicalInformationSchema } from "@cipher-health/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";

export default function SignupMedicalInformation() {

  const { handleSubmit, setErrors, formRef } = useFormStep({
    resolver: zodResolver(clientMedicalInformationSchema),
  })

  const createProfile = useCreateProfile()

  const onSubmit: FormStepSubmitHandler = useCallback(async (data, mergedData) => {
    // Merge all data from previous steps
    const payload = {
      ...mergedData,
      ...data
    }

    const [_, error] = await createProfile(payload)
    if (error) {
      setErrors(error)
      return false
    }
    return true
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >

    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
      <TextField
        name="socialSecurityNumber"
        textInputProps={{
          baseInputProps: {
            label: "Numéro de sécurité sociale :"
          },
          placeholder: "Votre numéro de sécurité sociale"
        }}
      />
      <TextField
        name="mutualInsuranceNumber"
        textInputProps={{
          baseInputProps: {
            label: "Numéro de mutuelle (AMC) :"
          },
          placeholder: "Votre numéro de mutuelle"
        }}
      />
    </form>

  </AuthFormContainer>
}
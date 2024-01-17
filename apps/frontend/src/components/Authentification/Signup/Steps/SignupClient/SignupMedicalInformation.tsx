import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import TextInput from "@/components/Inputs/TextInput";
import useCreateProfile from "@/contexts/AuthProvider/hooks/useCreateProfile";
import TextField from "@/contexts/FormProvider/Fields/TextField";
import { FormStepSubmitHandler, useFormStep } from "@/contexts/FormProvider/hooks/useFormStep";
import { clientMedicalInformationSchema } from "@cipher-health/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";

const defaultValues = {
  "socialSecurityNumber": "187082A32132111",
  "mutualInsuranceNumber": "qsd"
}

export default function SignupMedicalInformation() {

  const { handleSubmit, formRef } = useFormStep({
    resolver: zodResolver(clientMedicalInformationSchema),
    defaultValues
  })

  const createProfile = useCreateProfile()

  const onSubmit: FormStepSubmitHandler = useCallback(async (data, submissionHistory) => {
    // Merge all data from previous steps
    const payload = {
      ...submissionHistory?.map(({ data }) => data).reduce((acc, data) => ({ ...acc, ...data }), {}),
      ...data
    }

    createProfile(payload)

    return false
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
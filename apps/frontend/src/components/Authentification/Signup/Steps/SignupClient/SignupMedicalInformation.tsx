import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import TextInput from "@/components/Inputs/TextInput";


export default function SignupMedicalInformation() {
  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex gap-6">
      <TextInput
        baseInputProps={{
          label: "Numéro de sécurité sociale :"
        }}
        placeholder="Votre numéro de sécurité sociale"
      />
      <TextInput
        baseInputProps={{
          label: "Numéro de mutuelle (AMC) :"
        }}
        placeholder="Votre numéro de mutuelle"
      />
    </div>

  </AuthFormContainer>
}
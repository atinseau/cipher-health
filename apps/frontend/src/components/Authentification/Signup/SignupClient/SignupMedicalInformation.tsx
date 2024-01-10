import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../../AuthContainer";


export default function SignupMedicalInformation() {
  return <AuthContainer
  title="Lorem ipsum"
  variant="full"
  >

    <div className="flex gap-6">
      <TextInput
        label="Numéro de sécurité sociale :"
        placeholder="Votre numéro de sécurité sociale"
      />
      <TextInput
        label="Numéro de mutuelle (AMC) :"
        placeholder="Votre numéro de mutuelle"
      />
    </div>

  </AuthContainer>
}
import TextInput from "@/components/Inputs/TextInput";
import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "@/components/Authentification/AuthFormContainer";


export default function SignupMedicalIdentifier() {
  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >
    <div className="flex gap-6">
      <TextInput
        baseInputProps={{
          label: "Numéro RPPS :"
        }}
        isRequired
        placeholder="11 chiffres"
      />
      <TextInput
        baseInputProps={{
          label: "Numéro AM :"
        }}
        isRequired
        placeholder="8 chiffres"
      />
    </div>

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>

  </AuthFormContainer>
}
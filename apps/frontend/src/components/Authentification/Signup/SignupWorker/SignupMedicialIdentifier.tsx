import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../../AuthContainer";
import InformationCard from "@/components/Card/InformationCard";


export default function SignupMedicalIdentifier() {
  return <AuthContainer
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

  </AuthContainer>
}
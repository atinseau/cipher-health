import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../AuthContainer";
import InformationCard from "@/components/Card/InformationCard";


export default function SignupAddress() {
  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >
    <div className="flex flex-col gap-6">
      <TextInput
        baseInputProps={{
          label: "Adresse :"
        }}
        isRequired
        placeholder="Numéro et rue"
      />
      <TextInput placeholder="Complément d’adresse" />
      <div className="flex gap-6">
        <TextInput placeholder="Code postal" />
        <TextInput placeholder="Ville" />
      </div>
    </div>

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthContainer>
}
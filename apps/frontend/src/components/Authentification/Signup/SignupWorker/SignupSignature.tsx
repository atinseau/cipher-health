import DrawInput from "@/components/Inputs/DrawInput";
import AuthContainer from "../../AuthContainer";
import InformationCard from "@/components/Card/InformationCard";



export default function SignupSignature() {

  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >

    <DrawInput
      baseInputProps={{
        label: "Votre signature :",
      }}
      isRequired
      title="Dessiner avec votre souris"
    />

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>

  </AuthContainer>

}
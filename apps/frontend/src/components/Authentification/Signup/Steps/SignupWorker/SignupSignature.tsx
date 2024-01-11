import DrawInput from "@/components/Inputs/DrawInput";
import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "@/components/Authentification/AuthFormContainer";



export default function SignupSignature() {

  return <AuthFormContainer
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

  </AuthFormContainer>

}
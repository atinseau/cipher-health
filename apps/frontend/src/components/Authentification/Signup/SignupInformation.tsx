import RadioInput from "@/components/Inputs/RadioInput";
import AuthContainer from "../AuthContainer";
import TextInput from "@/components/Inputs/TextInput";
import DateInput from "@/components/Inputs/DateInput";
import InformationCard from "@/components/Cards/InformationCard";

import { IoInformationCircleOutline } from "react-icons/io5";


export default function SignupInformation() {

  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >
    <div className="flex flex-col gap-6">
      <RadioInput
        label="Vous êtes :"
        subLabel="La réglementation du système de santé français nous oblige à vous demander cette information."
        isRequired
        orientation="horizontal"
        items={[
          { label: "Un Homme", value: "MALE" },
          { label: "Une femme", value: "FEMALE" },
        ]}
      />

      <div className="flex gap-6">
        <TextInput
          label="Prénom : "
          placeholder="Votre prénom"
          isRequired
        />

        <TextInput
          label="Nom :"
          placeholder="Votre nom"
          isRequired
        />
      </div>

      <div className="flex gap-6">
        <TextInput
          label="Nom de naissance :"
          placeholder="Votre nom de naissance"
        />

        <DateInput
          label="Date de naissance :"
          placeholder="DD/MM/YYYY"
          autoClose
          isRequired
        />
      </div>

      <TextInput
        label="Lieu de naissance :"
        isRequired
        placeholder="Votre lieu de naissance"
      />

      <InformationCard startContent={<IoInformationCircleOutline size={20} className="text-indigo-500"/>}>
        <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
      </InformationCard>
    </div>
  </AuthContainer>

}
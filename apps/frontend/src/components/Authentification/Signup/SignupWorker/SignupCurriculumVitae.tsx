import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../../AuthContainer";
import Select from "@/components/Select";
import FileInput from "@/components/Inputs/FileInput";
import InformationCard from "@/components/Cards/InformationCard";
import { IoInformationCircleOutline } from "react-icons/io5";


export default function SignupCurriculumVitae() {
  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <Select
          label="Type de diplôme :"
          isRequired
          placeholder="Sélectionner dans la liste"
          items={[
            { label: "Bac", value: "bac" },
          ]}
        />
        <TextInput
          label="Année d’obtention : "
          isRequired
          placeholder="L'année d'obtention"
        />
      </div>

      <TextInput
        label="Nom du diplôme obtenu : "
        isRequired
        placeholder="Le nom du diplôme obtenu"
      />

      <FileInput
        label="Votre diplôme : "
        title="Upload your file"
        subTitle=".png, .pdf or .jpeg (5Mo max)"
        isRequired
      />
    </div>

    <InformationCard startContent={<IoInformationCircleOutline size={20} className="text-indigo-500" />}>
      <p>Vous pourrez ajouter d’autres diplômes dans votre espace</p>
    </InformationCard>

  </AuthContainer>
}
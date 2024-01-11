import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../../AuthContainer";
import Select from "@/components/Inputs/SelectInput";
import FileInput from "@/components/Inputs/FileInput";
import InformationCard from "@/components/Card/InformationCard";


export default function SignupCurriculumVitae() {
  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <Select
          baseInputProps={{
            label: "Type de diplôme :",
            subLabel: "Sélectionner dans la liste"
          }}
          isRequired
          placeholder="Sélectionner dans la liste"
          items={[
            { label: "Bac", value: "bac" },
          ]}
        />
        <TextInput
          baseInputProps={{
            label: "Année d’obtention : "
          }}
          isRequired
          placeholder="L'année d'obtention"
        />
      </div>

      <TextInput
        baseInputProps={{
          label: "Nom du diplôme obtenu : "
        }}
        isRequired
        placeholder="Le nom du diplôme obtenu"
      />

      <FileInput
        baseInputProps={{
          label: "Votre diplôme : "
        }}
        title="Upload your file"
        subTitle=".png, .pdf or .jpeg (5Mo max)"
        isRequired
      />
    </div>

    <InformationCard>
      <p>Vous pourrez ajouter d’autres diplômes dans votre espace</p>
    </InformationCard>

  </AuthContainer>
}
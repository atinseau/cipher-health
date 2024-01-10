import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../../AuthContainer";
import Select from "@/components/Select";


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
    </div>

  </AuthContainer>
}
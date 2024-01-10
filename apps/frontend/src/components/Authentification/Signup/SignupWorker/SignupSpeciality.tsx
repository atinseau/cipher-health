import AuthContainer from "../../AuthContainer";
import Select from "@/components/Select";
import AutocompleteInput from "@/components/Inputs/AutocompleteInput";
import Chip from "@/components/Chip";


export default function SignupSpeciality() {
  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">
      <Select
        label="Votre spécialité :"
        placeholder="Sélectionner dans la liste"
        items={[
          { value: "generaliste", label: "Medecin généraliste" }
        ]}
      />

      <AutocompleteInput
        label="Vos expertises : "
        placeholder="Sélectionner dans la liste"
        items={[
          { value: "expertise-1", label: "Expertise 1" },
          { value: "expertise-1.1", label: "Expertise 1.1" },
          { value: "expertise-2", label: "Expertise 2" },
          { value: "expertise-3", label: "Expertise 3" },
          { value: "expertise-4", label: "Expertise 4" },
          { value: "expertise-5", label: "Expertise 5" },
        ]}
      />

      <div className="flex gap-4">
        <Chip label="Expertise 1" onDelete={true as any} />
        <Chip label="Expertise 2" onDelete={true as any} />
      </div>
    </div>

  </AuthContainer>
}
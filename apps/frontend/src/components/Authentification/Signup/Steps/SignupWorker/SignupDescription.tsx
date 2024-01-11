import AuthFormContainer from "@/components/Authentification/AuthFormContainer";
import AvatarInput from "@/components/Inputs/AvatarInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput";



export default function SignupDescription() {


  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">


      <AvatarInput
        baseInputProps={{
          label: "Photo de profil :"
        }}
      />

      <TextAreaInput
        placeholder="Présentez-vous en quelques mots"
        isRequired
        baseInputProps={{
          label: "Votre présentation :"
        }}
      />

    </div>

  </AuthFormContainer>

}
import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../AuthContainer";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Button from "@/components/Button";
import { AiOutlineMail } from "react-icons/ai";



export default function SigninCredential() {

  return <AuthContainer
    title="Connectez-vous pour prendre rendez-vous"
    subTitle="Lorem ipsum dolor sit amet consectetur. Neque magna viverra vel nullam arcu sollicitudin."
    footer={<div className="flex flex-col">
      <Button className="mb-8" isDisabled>Se connecter</Button>
      <a className="mb-4">Pas encore de compte ?</a>
      <Button variant="outlined">Créer mon compte</Button>
    </div>}
  >
    <div className="w-full flex flex-col gap-8">
      <TextInput
        label="Email :"
        placeholder="Votre Email"
        endContent={<AiOutlineMail className="text-indigo-500" />}
      />
      <PasswordInput
        label="Mot de passe :"
        placeholder="Votre mot de passe"
        subLabel="Mot de passe oublié ? "
      />
    </div>
  </AuthContainer>

}
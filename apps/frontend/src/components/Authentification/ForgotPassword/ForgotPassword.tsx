import TextInput from "@/components/Inputs/TextInput";
import AuthFormContainer from "../AuthFormContainer";
import { AiOutlineMail } from "react-icons/ai";
import Button from "@/components/Button";



export default function ForgotPassword() {
  return <AuthFormContainer
    title="Veuillez renseigner votre e-mail"
    subTitle="Un lien de réinitialisation va vous être envoyé"
    color="secondary"
    footer={<>
      <Button className="w-full max-w-[148px]" isDisabled>Envoyer</Button>
      <div className="flex gap-2 items-center">
        <p>Pas encore reçu ? </p>
        <Button variant="plain">Renvoyer le mail</Button>
      </div>
    </>}
  >
    <div className="w-full flex flex-col gap-8">
      <TextInput
        baseInputProps={{
          label: "Email :"
        }}
        placeholder="Votre Email"
        endContent={<AiOutlineMail className="text-indigo-500" />}
      />
    </div>
  </AuthFormContainer>
}
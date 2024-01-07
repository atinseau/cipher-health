import TextInput from "@/components/Inputs/TextInput";
import AuthContainer from "../AuthContainer";
import { AiOutlineMail } from "react-icons/ai";



export default function ForgotPassword() {
  return <div className="flex justify-center">
    <AuthContainer
      title="Veuillez renseigner votre e-mail"
      subTitle="Un lien de réinitialisation va vous être envoyé"
      subTitleClassName="text-base text-black"
    >
      <div className="w-full flex flex-col gap-8">
        <TextInput
          label="Email :"
          placeholder="Votre Email"
          endContent={<AiOutlineMail className="text-indigo-500" />}
        />
      </div>
    </AuthContainer>
  </div>
}
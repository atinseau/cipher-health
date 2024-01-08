import PasswordInput from "@/components/Inputs/PasswordInput";
import TextInput from "@/components/Inputs/TextInput";
import { AiOutlineMail } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Divider } from "@nextui-org/react";
import AuthContainer from "../AuthContainer";



export default function SignupRegistrationStep() {
  return <AuthContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">
      <TextInput
        label="Votre email de connexion :"
        placeholder="Votre email"
        isRequired
        endContent={<AiOutlineMail className="text-indigo-500" />}
      />

      <PasswordInput
        label="Votre Mot de passe :"
        placeholder="Votre mot de passe"
        enableStrength
        isRequired
      />

      <TextInput
        label="Confirmez votre mot de passe"
        placeholder="Votre mot de passe"
        isRequired
        endContent={<RxCross1 className="text-red-500" size={20} />}
      />

      <Divider />

      <TextInput
        label="Téléphone :"
        isRequired
        placeholder="Votre numéro de téléphone"
        subLabel="Lorem ipsum / utilisation pour validation compte "
      />
    </div>

  </AuthContainer>
}
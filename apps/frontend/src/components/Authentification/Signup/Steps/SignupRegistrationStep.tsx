import PasswordInput from "@/components/Inputs/PasswordInput";
import TextInput from "@/components/Inputs/TextInput";
import { AiOutlineMail } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Divider } from "@nextui-org/divider";
import AuthFormContainer from "../../AuthFormContainer";


export default function SignupRegistrationStep() {
  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >

    <div className="flex flex-col gap-6">
      <TextInput
        baseInputProps={{
          label: "Votre email de connexion :"
        }}
        placeholder="Votre email"
        isRequired
        endContent={<AiOutlineMail className="text-indigo-500" />}
      />

      <PasswordInput
        baseInputProps={{
          label: "Votre mot de passe :"
        }}
        placeholder="Votre mot de passe"
        enableStrength
        isRequired
      />

      <TextInput
        baseInputProps={{
          label: "Confirmez votre mot de passe"
        }}
        placeholder="Votre mot de passe"
        isRequired
        endContent={<RxCross1 className="text-red-500" size={20} />}
      />

      <Divider />

      <TextInput
        baseInputProps={{
          label: "Téléphone :",
          subLabel: "Lorem ipsum / utilisation pour validation compte "
        }}
        isRequired
        placeholder="Votre numéro de téléphone"
      />
    </div>

  </AuthFormContainer>
}
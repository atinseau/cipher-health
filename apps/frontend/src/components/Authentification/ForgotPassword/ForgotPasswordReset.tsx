import PasswordInput from "@/components/Inputs/PasswordInput";
import AuthContainer from "../AuthContainer";
import Button from "@/components/Button";


export default function ForgotPasswordReset() {
  return <div className="flex justify-center">
    <AuthContainer
      title="Entrez votre nouveau mot de passe"
      subTitle="Lorem ipsum dolor sit amet"
      subTitleClassName="text-base text-black"
      footer={<Button isDisabled>Se connecter</Button>}
    >
      <div className="w-full flex flex-col gap-8">
        <PasswordInput
          label="Votre nouveau mot de passe :"
          placeholder="Mot de passe"
          enableStrength
        />
        <PasswordInput
          label="Confirmez votre mot de passe :"
          placeholder="Mot de passe"
        />
      </div>
    </AuthContainer>
  </div>
}
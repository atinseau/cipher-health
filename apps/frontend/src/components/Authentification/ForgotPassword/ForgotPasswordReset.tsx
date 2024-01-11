import PasswordInput from "@/components/Inputs/PasswordInput";
import AuthFormContainer from "../AuthFormContainer";
import Button from "@/components/Button";


export default function ForgotPasswordReset() {
  return <AuthFormContainer
    title="Entrez votre nouveau mot de passe"
    subTitle="Lorem ipsum dolor sit amet"
    color="secondary"
    footer={<Button isDisabled>Se connecter</Button>}
  >
    <div className="w-full flex flex-col gap-8">
      <PasswordInput
        baseInputProps={{
          label: "Votre nouveau mot de passe :"
        }}
        placeholder="Mot de passe"
        enableStrength
      />
      <PasswordInput
        baseInputProps={{
          label: "Confirmez votre mot de passe :"
        }}
        placeholder="Mot de passe"
      />
    </div>
  </AuthFormContainer>
}
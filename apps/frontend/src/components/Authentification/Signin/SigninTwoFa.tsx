import CodeInput from "@/components/Inputs/CodeInput";
import AuthFormContainer from "../AuthFormContainer";
import Button from "@/components/Button";


export default function SigninTwoFa() {
  return <AuthFormContainer
    title="Sécurité double authentification"
    color="secondary"
    subTitle="Merci de rentrer le code reçu par sms au 06 •• •• •• 12 pour vous connecter"
    footer={<div className="flex gap-2 items-center">
      <p>Pas encore reçu ? </p>
      <Button variant="plain">Renvoyer le SMS</Button>
    </div>}
  >
    <CodeInput />
  </AuthFormContainer>
}
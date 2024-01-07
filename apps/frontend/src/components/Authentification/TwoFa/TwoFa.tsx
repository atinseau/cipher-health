import CodeInput from "@/components/Inputs/CodeInput";
import AuthContainer from "../AuthContainer";
import Button from "@/components/Button";


export default function TwoFa() {


  return <div className="flex justify-center">
    <AuthContainer
      title="Sécurité double authentification"
      subTitle="Merci de rentrer le code reçu par sms au 06 •• •• •• 12 pour vous connecter"
      subTitleClassName="text-base text-black"
      footer={<div className="flex gap-2 items-center">
        <p>Pas encore reçu ? </p>
        <Button variant="plain">Renvoyer le SMS</Button>
      </div>}
    >
      <CodeInput />
    </AuthContainer>
  </div>

}
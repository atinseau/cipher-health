import CodeInput from "@/components/Inputs/CodeInput";
import Button from "@/components/Button";
import AuthFormContainer from "../../AuthFormContainer";


export default function SignupTwoFa() {
  return <AuthFormContainer
    title="Lorem ipsum"
    subTitle="Merci de rentrer le code reçu par sms au 06 •• •• •• 12 pour vous connecter "
    variant="full"
    classNames={{
      header: "flex flex-col gap-8",
      headerSubTitle: "text-base text-black text-center",
      content: "items-center"
    }}
    footer={
      <><div className="flex gap-2 items-center">
        <p>Pas encore reçu ? </p>
        <Button variant="plain">Renvoyer le SMS</Button>
      </div>
      </>
    }
  >
    <CodeInput />
  </AuthFormContainer>
}
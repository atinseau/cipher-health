import AuthContainer from "@/components/Authentification/AuthContainer";
import Signin from "@/components/Authentification/Signin/Signin";

export default function SigninPage() {
  return <AuthContainer src="/assets/svg/signin.svg">
    <Signin />
  </AuthContainer>
}
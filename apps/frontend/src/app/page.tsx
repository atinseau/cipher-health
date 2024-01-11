import AuthContainer from "@/components/Authentification/AuthContainer";
import Signup from "@/components/Authentification/Signup/Signup";



export default function SignupPage() {
  return <AuthContainer src="/assets/svg/client-signup.svg">
    <Signup />
  </AuthContainer>
}
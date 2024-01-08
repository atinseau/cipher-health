import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import SigninCredential from "@/components/Authentification/Signin/SigninCredential";
import SignupRegistrationStep from "@/components/Authentification/Signup/SignupRegistrationStep";
import SigninTwoFa from "@/components/Authentification/Signin/SigninTwoFa";

export default function Page() {

  return <div className="flex flex-col gap-32 items-center">

    <SignupRegistrationStep />

    <ForgotPasswordReset />
    <ForgotPassword />
    <SigninTwoFa />
    <SigninCredential />

  </div>
}
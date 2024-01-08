import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import SigninCredential from "@/components/Authentification/Signin/SigninCredential";
import SignupRegistrationStep from "@/components/Authentification/Signup/SignupRegistrationStep";
import SigninTwoFa from "@/components/Authentification/Signin/SigninTwoFa";
import SignupTwoFa from "@/components/Authentification/Signup/SignupTwoFa";

export default function Page() {

  return <div className="flex flex-col gap-32 items-center">

    <SignupTwoFa />
    <SignupRegistrationStep />

    <ForgotPasswordReset />
    <ForgotPassword />
    <SigninTwoFa />
    <SigninCredential />

  </div>
}
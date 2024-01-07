import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import Signin from "@/components/Authentification/Signin/Signin";
import TwoFa from "@/components/Authentification/TwoFa/TwoFa";

export default function Page() {

  return <div className="flex flex-col gap-32">

    <ForgotPasswordReset />
    <ForgotPassword />
    <TwoFa />
    <Signin />

  </div>
}
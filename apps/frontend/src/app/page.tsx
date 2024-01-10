import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import SigninCredential from "@/components/Authentification/Signin/SigninCredential";
import SignupRegistrationStep from "@/components/Authentification/Signup/SignupRegistrationStep";
import SigninTwoFa from "@/components/Authentification/Signin/SigninTwoFa";
import SignupTwoFa from "@/components/Authentification/Signup/SignupTwoFa";
import SignupInformation from "@/components/Authentification/Signup/SignupInformation";
import SignupAddress from "@/components/Authentification/Signup/SignupAddress";
import SignupMedicalInformation from "@/components/Authentification/Signup/SignupClient/SignupMedicalInformation";
import SignupMedicalIdentifier from "@/components/Authentification/Signup/SignupWorker/SignupMedicialIdentifier";
import SignupCurriculumVitae from "@/components/Authentification/Signup/SignupWorker/SignupCurriculumVitae";
import Link from "next/link";

export default function Page() {

  return <div className="flex flex-col gap-32 items-center">

    <Link href="/playground">Go to playground</Link>

    <SignupCurriculumVitae />

    <SignupMedicalIdentifier />

    <SignupMedicalInformation />
    <SignupAddress />

    <SignupInformation />
    <SignupTwoFa />
    <SignupRegistrationStep />

    <ForgotPasswordReset />
    <ForgotPassword />
    <SigninTwoFa />
    <SigninCredential />

  </div>
}
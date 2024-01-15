import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import SigninCredential from "@/components/Authentification/Signin/SigninCredential";
import SigninTwoFa from "@/components/Authentification/Signin/SigninTwoFa";
import SignupAddress from "@/components/Authentification/Signup/Steps/SignupAddress";
import Link from "next/link";
import SignupDescription from "@/components/Authentification/Signup/Steps/SignupWorker/SignupDescription";
import SignupSignature from "@/components/Authentification/Signup/Steps/SignupWorker/SignupSignature";
import SignupSpeciality from "@/components/Authentification/Signup/Steps/SignupWorker/SignupSpeciality";
import SignupCurriculumVitae from "@/components/Authentification/Signup/Steps/SignupWorker/SignupCurriculumVitae";
import SignupMedicalIdentifier from "@/components/Authentification/Signup/Steps/SignupWorker/SignupMedicialIdentifier";
import SignupMedicalInformation from "@/components/Authentification/Signup/Steps/SignupClient/SignupMedicalInformation";

export default function Page() {

  return <div className="flex flex-col gap-32 items-center">

    <Link href="/playground">Go to playground</Link>

    <SignupDescription />
    <SignupSignature />

    <SignupSpeciality />
    <SignupCurriculumVitae />

    <SignupMedicalIdentifier />

    <SignupMedicalInformation />
    <SignupAddress />

    <ForgotPasswordReset />
    <ForgotPassword />
    <SigninTwoFa />
    <SigninCredential />

  </div>
}
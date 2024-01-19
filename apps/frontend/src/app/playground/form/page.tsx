import ForgotPassword from "@/components/Authentification/ForgotPassword/ForgotPassword";
import ForgotPasswordReset from "@/components/Authentification/ForgotPassword/ForgotPasswordReset";
import Link from "next/link";
import SignupDescription from "@/components/Authentification/Signup/Steps/SignupWorker/SignupDescription";
import SignupSignature from "@/components/Authentification/Signup/Steps/SignupWorker/SignupSignature";
import SignupSpeciality from "@/components/Authentification/Signup/Steps/SignupWorker/SignupSpeciality";
import SignupCurriculumVitae from "@/components/Authentification/Signup/Steps/SignupWorker/SignupCurriculumVitae";
import SignupMedicalIdentifier from "@/components/Authentification/Signup/Steps/SignupWorker/SignupMedicialIdentifier";

export default function Page() {

  return <div className="flex flex-col gap-32 items-center">
    <Link href="/playground">Go to playground</Link>
    <SignupDescription />
    <SignupSignature />
    <SignupSpeciality />
    <SignupCurriculumVitae />
    <SignupMedicalIdentifier />
    <ForgotPasswordReset />
    <ForgotPassword />
  </div>
}
'use client';

import { DisplayFormStep, FormProvider, FormStep } from "@cipher-health/form";
import SigninCredential from "./SigninCredential";
import SigninTwoFa from "./SigninTwoFa";
import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";
import { useRouter } from "next/navigation";
import { DASHBOARD_URL } from "@/utils/constants";
import { useEffect } from "react";
import useUser from "@/contexts/AuthProvider/hooks/useUser";

const steps: FormStep[] = [
  {
    components: [
      SigninCredential,
    ]
  },
  {
    components: [
      SigninTwoFa
    ]
  }
]

export default function Signin() {

  const notify = useNotify()
  const router = useRouter()
  const { isConnected, loading } = useUser()

  // Should never happen because nextjs middleware should redirect to dashboard if connected
  useEffect(() => {
    if (loading) return
    if (isConnected) {
      notify({
        type: 'info',
        title: "Vous êtes déjà connecté",
        message: "Redirection vers votre espace personnel",
      })
      router.push(DASHBOARD_URL)
    }
  }, [isConnected])

  return <FormProvider
    steps={steps}
    afterLastStep={() => {
      router.push(DASHBOARD_URL)
    }}
    onError={(error) => {
      notify({
        type: 'error',
        title: 'Une erreur est survenue',
        message: error?.message || 'Le serveur a rencontré une erreur.'
      })
    }}
  >
    <div className="flex flex-col justify-center h-full">
      <DisplayFormStep />
    </div>
  </FormProvider>

}
'use client';

import { useRouter } from 'next/navigation'
import { clientSteps, mobileClientSteps } from "./steps";
import SignupForm from "./SignupForm";
import { createContext, useCallback, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { signupInfoAtom, signupStore } from "./signupStore";
import { Provider } from "jotai";
import { SignupInfo } from "@cipher-health/sdk";
import SmoothEnter from "@/components/Animation/SmoothEnter";
import SmoothExit from "@/components/Animation/SmoothExit";
import { AnimatePresence } from "framer-motion";

import { FormProvider, FormStep } from "@cipher-health/form"
import useNotify from "@/contexts/NotificationProvider/hooks/useNotify";
import { DASHBOARD_URL, MOBILE_MEDIA_QUERY } from '@/utils/constants';
import useUser from '@/contexts/AuthProvider/hooks/useUser';
import { useMediaQuery } from '@cipher-health/utils/react';

type ISignupContext = {
  hydrateSignupInfo: () => Promise<SignupInfo | null>
}

export const SignupContext = createContext({} as ISignupContext)

export default function Signup() {

  const [steps, setSteps] = useState<FormStep[]>([])
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [subStepIndex, setSubStepIndex] = useState<number>(0)
  const { isConnected, loading } = useUser()

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  const notify = useNotify()
  const router = useRouter()

  const authentificator = useAuthentificator()

  const hydrateSignupInfo = useCallback(async () => {
    const signupInfo = await authentificator.getSignupInfo()

    // Save signup info for later use in signup form
    signupStore.set(signupInfoAtom, signupInfo)
    return signupInfo
  }, [])

  const handleRedirect = useCallback(() => {
    notify({
      title: "Félicitations !",
      message: "Votre compte a été créé avec succès",
    })
    router.push(DASHBOARD_URL)
  }, [])

  useEffect(() => {
    if (loading) return

    // Should never happen because nextjs middleware should redirect to dashboard if connected
    if (isConnected) {
      notify({
        type: 'info',
        title: "Vous êtes déjà connecté",
        message: "Redirection vers votre espace personnel",
      })
      router.push(DASHBOARD_URL)
      return
    }

    // Compute steps set depending on user type
    let computedSteps = isMobile
      ? mobileClientSteps
      : clientSteps

    hydrateSignupInfo().then((signupInfo) => {
      if (signupInfo?.status === "USER_NOT_VERIFIED") {
        setStepIndex(0)
        setSubStepIndex(1)
      }

      if (signupInfo?.status === "USER_NOT_COMPLETED") {
        setStepIndex(1)
        setSubStepIndex(0)
      }
      setSteps(computedSteps)
    })
  }, [
    isConnected,
    isMobile
  ])

  return <AnimatePresence>
    {!steps.length
      ? <SmoothExit>
        <Spinner />
      </SmoothExit>
      : <SmoothEnter>
        <Provider store={signupStore}>
          <FormProvider
            steps={steps}
            initialStepIndex={stepIndex}
            initialSubStepIndex={subStepIndex}
            afterLastStep={handleRedirect}
            beforeStepChange={hydrateSignupInfo}
          >
            <SignupForm />
          </FormProvider>
        </Provider>
      </SmoothEnter>}
  </AnimatePresence>
}
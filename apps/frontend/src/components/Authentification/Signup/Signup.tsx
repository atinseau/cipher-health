'use client';

import { clientSteps } from "./steps";
import SignupForm from "./SignupForm";
import { createContext, useCallback, useState } from "react";
import Spinner from "@/components/Spinner";
import { useAuthentificator } from "@cipher-health/sdk/react";
import { signupInfoAtom, signupStore } from "./signupStore";
import { Provider } from "jotai";
import { SignupInfo } from "@cipher-health/sdk";
import { useMount } from "@cipher-health/utils/react";
import SmoothEnter from "@/components/Animation/SmoothEnter";
import SmoothExit from "@/components/Animation/SmoothExit";
import { AnimatePresence } from "framer-motion";

import { FormProvider, FormStep } from "@cipher-health/form"

type ISignupContext = {
  hydrateSignupInfo: () => Promise<SignupInfo | null>
}

export const SignupContext = createContext({} as ISignupContext)

export default function Signup() {

  const [steps, setSteps] = useState<FormStep[]>([])
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [subStepIndex, setSubStepIndex] = useState<number>(0)

  const authentificator = useAuthentificator()

  const hydrateSignupInfo = useCallback(async () => {
    const signupInfo = await authentificator.getSignupInfo()
    // Save signup info for later use in signup form
    signupStore.set(signupInfoAtom, signupInfo)
    return signupInfo
  }, [])

  useMount(() => {
    // Compute steps set depending on user type
    let computedSteps = clientSteps

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
  })

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
            beforeStepChange={hydrateSignupInfo}
          >
            <SignupForm />
          </FormProvider>
        </Provider>
      </SmoothEnter>}
  </AnimatePresence>
}
import { DisplayFormStep, FormProvider, FormStep } from "@cipher-health/form";
import CustomPage from "@/components/CustomPage";
import Registration from "./Steps/Registration";
import Verifying from "./Steps/Verifying";
import ProfileInformation from "./Steps/Profile/ProfileInformation";
import ProfileAddress from "./Steps/Profile/ProfileAddress";
import { useNotify } from "react-admin";

import { useMount } from "@cipher-health/utils/react"
import { useCallback, useState } from "react";
import { authentificator } from "@/auth";
import { signupInfoAtom, signupStore, stwtAtom } from "./signupStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { invalidLinkError } from "@/lib/errors";
import { Provider } from "jotai";

const signupSteps: FormStep[] = [
  {
    components: [
      Registration
    ],
  },
  {
    components: [
      Verifying
    ]
  },
  {
    components: [
      ProfileInformation,
      ProfileAddress
    ]
  }
]

export default function Signup() {

  const notify = useNotify()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const [steps, setSteps] = useState<FormStep[]>([])
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [subStepIndex, setSubStepIndex] = useState<number>(0)

  const hydrateSignupInfo = useCallback(async () => {
    const stwt = searchParams.get('stwt')
    if (!stwt) {
      notify(invalidLinkError)
      navigate('/login')
      return
    }
    const signupInfo = await authentificator.getSignupInfo(stwt)
    if (!signupInfo) {
      notify(invalidLinkError)
      navigate('/login')
      return
    }
    // Save signup info for later use in signup form

    signupStore.set(stwtAtom, stwt)
    signupStore.set(signupInfoAtom, signupInfo)
    return signupInfo
  }, [])

  useMount(() => {
    hydrateSignupInfo().then((signupInfo) => {

      if (signupInfo?.status === 'USER_NOT_VERIFIED') {
        setStepIndex(1)
        setSubStepIndex(0)
      }

      if (signupInfo?.status === 'USER_NOT_COMPLETED') {
        setStepIndex(2)
        setSubStepIndex(0)
      }

      setSteps(signupSteps)
    })
  })

  return <CustomPage>
    {steps.length ? <Provider store={signupStore}>
      <FormProvider
        steps={steps}
        initialStepIndex={stepIndex}
        initialSubStepIndex={subStepIndex}
        beforeStepChange={hydrateSignupInfo}
        onError={(error) => notify(error.message, {
          type: "error"
        })}
      >
        <DisplayFormStep />
      </FormProvider>
    </Provider> : null}
  </CustomPage>

}
import { useCallback, useEffect, useRef, useState } from "react";
import Registration from "./Registration";
import SignupContainer from "./SignupContainer";
import Verifying from "./Verifying";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNotify } from "react-admin";
import { useClient } from "@cipher-health/sdk/react";
import Profile from "./Profile";
import { invalidLinkError } from "../../../../lib/errors";

const steps = [
  Registration,
  Verifying,
  Profile,
]

export default function AdminSignup() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const notify = useNotify()
  const client = useClient()


  const stwtRef = useRef<string>(searchParams.get('stwt'))

  const [step, setStep] = useState(0)
  const [isBooting, setIsBooting] = useState(true)

  const Step = steps[step]

  useEffect(() => {
    if (!stwtRef.current) {
      notify(invalidLinkError)
      navigate('/login')
      return
    }

    checkProgress()
  }, [])

  const checkProgress = useCallback(async () => {
    const [res, error] = await client.get('/auth/signup/info', {
      ttl: 100, // 100ms of cache
      query: {
        stwt: stwtRef.current!
      }
    })
    setIsBooting(false)

    if (error) {
      notify(error.message, {
        type: 'error'
      })
      navigate('/login')
      return
    }

    if (res?.data?.status === 'USER_NOT_VERIFIED') {
      setStep(1)
    } else if (res?.data?.status === 'USER_NOT_COMPLETED') {
      setStep(2)
    }

    return res?.data
  }, [])

  return <SignupContainer isBooted={!isBooting}>
    <Step
      checkProgress={checkProgress}
      stwt={stwtRef.current!}
    />
  </SignupContainer>
}
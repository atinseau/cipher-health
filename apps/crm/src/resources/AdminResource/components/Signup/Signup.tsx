import { useCallback, useEffect, useRef, useState } from "react";
import Registration from "./Registration";
import SignupContainer from "./SignupContainer";
import Verifying from "./Verifying";
import { useNavigate, useSearchParams } from "react-router-dom";
import { invalidLinkError } from "./errors";
import { useNotify } from "react-admin";

const steps = [
  Registration,
  Verifying
]

export default function AdminSignup() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const notify = useNotify()

  const stwtRef = useRef<string>(searchParams.get('stwt'))

  const [step, setStep] = useState(0)

  const Step = steps[step]
  const next = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    }
  }, [step])

  useEffect(() => {
    if (!stwtRef.current) {
      notify(invalidLinkError)
      navigate('/login')
    }
  }, [])

  return <SignupContainer>
    <Step next={next} stwt={stwtRef.current!} />
  </SignupContainer>
}
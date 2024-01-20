import CustomPage from "@/components/CustomPage";
import SigninLogin from "./SigninLogin";
import { DisplayFormStep, FormProvider, FormStep } from "@cipher-health/form";
import SigninVerifying from "./SigninVerifying";
import { Loading, useAuthProvider, useAuthState, useNotify, useRedirect } from "react-admin";
import { useEffect, useState } from "react";

const signupSteps: FormStep[] = [
  {
    components: [
      SigninLogin,
      SigninVerifying
    ]
  }
]


export default function SigninPage() {

  const authProvider = useAuthProvider()
  const redirect = useRedirect();
  const notify = useNotify()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authProvider.checkAuth({})
      .then(() => {
        redirect('/')
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return <CustomPage>
    <FormProvider
      steps={signupSteps}
      onError={(error) => notify(error.message, { type: 'error' })}
      afterLastStep={() => redirect('/')}
    >
      <DisplayFormStep />
    </FormProvider>
  </CustomPage>
}
'use client';

import { clientSteps } from "./steps";
import SignupForm from "./SignupForm";
import FormProvider from "@/contexts/FormProvider/FormProvider";

export default function Signup() {

  const steps = clientSteps

  // Compute steps set depending on user type

  return <FormProvider steps={steps}>
    <SignupForm />
  </FormProvider>
}
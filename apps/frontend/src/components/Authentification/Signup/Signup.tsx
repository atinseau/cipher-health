'use client';

import FormProvider from "@/components/Form/FormProvider";
import { clientSteps } from "./steps";
import SignupForm from "./SignupForm";

export default function Signup() {

  const steps = clientSteps

  // Compute steps set depending on user type

  return <FormProvider steps={steps}>
    <SignupForm />
  </FormProvider>
}
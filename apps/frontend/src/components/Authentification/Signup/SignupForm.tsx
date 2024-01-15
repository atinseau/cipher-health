'use client';

import StepBar from "@/components/StepBar";
import SignupControl from "./SignupControl";
import { useFormContext } from "@/contexts/FormProvider/hooks/useFormContext";
import DisplayFormStep from "@/contexts/FormProvider/DisplayFormStep";


export default function SignupForm() {

  const { stepIndex, steps } = useFormContext()

  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-12">
      <StepBar
        currentStep={stepIndex}
        steps={steps.map(step => ({
          title: step.title, 
        }))}
      />
      <DisplayFormStep />
    </div>
    <SignupControl />
  </div>
}

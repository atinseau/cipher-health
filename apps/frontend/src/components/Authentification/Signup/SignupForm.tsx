'use client';

import StepBar from "@/components/StepBar";
import SignupControl from "./SignupControl";
import { DisplayFormStep, useFormContext } from "@cipher-health/form";


export default function SignupForm() {

  const { stepIndex, steps } = useFormContext()

  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-12 mb-6">
      <StepBar
        currentStep={stepIndex}
        steps={steps.map(step => ({
          title: step?.title || 'Unknown step',
        }))}
      />
      <DisplayFormStep />
    </div>
    <SignupControl />
  </div>
}

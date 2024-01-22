'use client';

import StepBar from "@/components/StepBar";
import SignupControl from "./SignupControl";
import { DisplayFormStep, useFormContext } from "@cipher-health/form";
import { useMediaQuery } from "@cipher-health/utils/react";
import { MOBILE_MEDIA_QUERY } from "@/utils/constants";


export default function SignupForm() {

  const { stepIndex, steps } = useFormContext()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)

  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-6 sm:gap-12 mb-6">
      {isMobile
        ? <p className="text-center text-indigo-400">{stepIndex + 1}/{steps.length} - {steps[stepIndex].title || 'Unknown step'}</p>
        : <StepBar
          currentStep={stepIndex}
          steps={steps.map(step => ({
            title: step?.title || 'Unknown step',
          }))}
        />
      }
      <DisplayFormStep />
    </div>
    <SignupControl />
  </div>
}

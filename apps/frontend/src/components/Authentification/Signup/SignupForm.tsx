'use client';

import Button from "@/components/Button";
import DisplayFormStep from "@/components/Form/DisplayFormStep";
import { useFormContext } from "@/components/Form/hooks/useFormContext";
import StepBar from "@/components/StepBar";
import { FaArrowRightLong } from "react-icons/fa6";


export default function SignupForm() {

  const {
    stepIndex,
    steps,
    onSubmit,
  } = useFormContext()

  return <div className="flex flex-col justify-between h-full">
    <div className="flex flex-col gap-12">
      <StepBar
        currentStep={stepIndex}
        steps={steps.map(step => ({
          title: step.title
        }))}
      />
      <DisplayFormStep />
    </div>

    <div className="flex justify-end">
      <Button
        endContent={<FaArrowRightLong />}
        onClick={onSubmit}
      >
        Suivant
      </Button>
    </div>

  </div>

}

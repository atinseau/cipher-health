'use client';

import Button from "@/components/Button";
import { useActiveForm, useActiveStep, useValidForm } from "@cipher-health/form";
import clsx from "clsx";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

type SignupControlProps = {
  className?: string
}

export default function SignupControl({ className }: SignupControlProps) {

  const { onSubmit } = useActiveForm()
  const { asPreviousButton, goBack } = useActiveStep()

  const isValid = useValidForm()

  return <div className={clsx("flex justify-end", className)}>
    {asPreviousButton && <Button
      variant="outlined"
      className="p-0 min-w-[44px] mr-auto"
      endContent={<FaArrowLeftLong />}
      onClick={goBack}
    />}
    <Button
      isDisabled={!isValid}
      endContent={<FaArrowRightLong />}
      className="justify-self-end"
      onClick={onSubmit}
    >
      Suivant
    </Button>
  </div>
}
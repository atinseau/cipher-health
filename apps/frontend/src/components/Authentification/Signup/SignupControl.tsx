'use client';

import Button from "@/components/Button";
import useActiveForm from "@/contexts/FormProvider/hooks/useActiveForm";
import useValidForm from "@/contexts/FormProvider/hooks/useValidForm";
import { FaArrowRightLong } from "react-icons/fa6";

export default function SignupControl() {

  const { onSubmit } = useActiveForm()

  const isValid = useValidForm()

  return <div className="flex justify-end">
    <Button
      isDisabled={!isValid}
      endContent={<FaArrowRightLong />}
      onClick={onSubmit}
    >
      Suivant
    </Button>
  </div>
}
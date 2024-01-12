'use client';

import Button from "@/components/Button";
import useActiveForm from "@/components/Form/hooks/useActiveForm";
import useValidForm from "@/components/Form/hooks/useValidForm";
import { useEffect } from "react";
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
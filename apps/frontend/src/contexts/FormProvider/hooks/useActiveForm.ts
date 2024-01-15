import { useMemo } from "react";
import { useFormContext } from "./useFormContext";

export default function useActiveForm() {

  const {
    onSubmit,
    getForm,
    stepIndex,
    subStepIndex,
  } = useFormContext();

  const form = useMemo(() => {
    return getForm(stepIndex, subStepIndex)
  }, [
    stepIndex,
    subStepIndex
  ])

  if (!form) {
    throw new Error('No form found in context')
  }

  return {
    form,
    onSubmit
  }
}
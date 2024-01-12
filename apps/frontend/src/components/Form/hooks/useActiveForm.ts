import { useFormContext } from "./useFormContext";

export default function useActiveForm() {

  const {
    onSubmit,
    getForm,
    stepIndex,
    subStepIndex,
  } = useFormContext();

  const form = getForm(stepIndex, subStepIndex);

  return {
    form,
    onSubmit
  }
}
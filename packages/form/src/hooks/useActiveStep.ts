import { useFormContext } from "./useFormContext";



export function useActiveStep() {
  const { steps, stepIndex, subStepIndex, goBack } = useFormContext();
  const activeStep = steps[stepIndex];
  if (!activeStep) {
    throw new Error('No active step found in context')
  }

  return {
    asPreviousButton: (activeStep.prev?.scoped && subStepIndex > 0) || activeStep.prev?.global,
    goBack
  }
}
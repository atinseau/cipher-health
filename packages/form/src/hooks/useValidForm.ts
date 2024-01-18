import { useCallback, useEffect, useState } from "react";
import { useActiveForm } from "./useActiveForm";
import { useFormContext } from "./useFormContext";

export function useValidForm() {

  const { form } = useActiveForm();
  const { getCurrentSubmission } = useFormContext()

  const [isValid, setIsValid] = useState(false);

  // If there are errors on mount, set initial validity to false
  // and delete the errors from the current submission
  // because they are only rendered on mount after we don't want them anymore
  const validate = useCallback(() => {
    const currentSubmission = getCurrentSubmission()
    if (currentSubmission?.errors) {
      setIsValid(false)
      delete currentSubmission.errors
      return
    }
    form.trigger().then(setIsValid)
  }, [
    form,
    form.trigger
  ])

  useEffect(() => {
    // Set initial validity to false if there are errors on mount
    // setIsValid(false)
    validate() // Trigger validation on mount
    const subscription = form.watch(validate); // Trigger validation on change
    return () => {
      subscription.unsubscribe();
    };
  }, [
    validate,
    form.watch
  ])

  return isValid
}
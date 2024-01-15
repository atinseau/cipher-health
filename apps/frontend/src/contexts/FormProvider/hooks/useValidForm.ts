import { useCallback, useEffect, useState } from "react";
import useActiveForm from "./useActiveForm";

export default function useValidForm() {

  const { form } = useActiveForm();
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(() => {
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
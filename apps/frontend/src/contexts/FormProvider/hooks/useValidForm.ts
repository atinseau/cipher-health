import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "./useFormContext";
import useActiveForm from "./useActiveForm";
import { useFormState } from "react-hook-form";


export default function useValidForm() {

  const { form } = useActiveForm();

  const formState = useFormState({
    control: form.control
  })

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (Object.keys(formState.errors).length !== 0) {
      setIsValid(false)
      return
    }
    setIsValid(true)
  }, [formState])

  const trigger = useCallback(() => {
    form.trigger()
  }, [])

  useEffect(() => {
    trigger()
    const subscription = form.watch(trigger);
    return () => {
      subscription.unsubscribe();
    };
  }, [form.watch])

  return isValid
}
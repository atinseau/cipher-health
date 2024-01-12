import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "./useFormContext";
import useActiveForm from "./useActiveForm";


export default function useValidForm() {

  const { form } = useActiveForm();

  const [isValid, setIsValid] = useState(false);

  const trigger = useCallback(() => {
    form.trigger().then((valid) => {
      setIsValid(valid);
    })
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
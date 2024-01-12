import { useMemo } from "react";
import { useFormState } from "react-hook-form";
import useActiveForm from "./useActiveForm";


export default function useFormError(name: string) {

  const { form } = useActiveForm();

  const formState = useFormState({
    control: form.control,
    exact: true,
    name
  })

  const errors = useMemo(() => {
    const error = formState.errors[name]
    if (error && formState.submitCount > 0) {
      return {
        isInvalid: true,
        errorText: error.message?.toString()
      }
    }
    return {}
  }, [formState])

  return errors
}
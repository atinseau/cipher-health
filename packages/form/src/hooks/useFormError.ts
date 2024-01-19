import { useMemo } from "react";
import { useFormState } from "react-hook-form";
import { useActiveForm } from "./useActiveForm";

export function useFormError(name: string) {

  const { form } = useActiveForm();

  const formState = useFormState({
    control: form.control,
    exact: true,
    name
  })

  const errors = useMemo(() => {
    const mode = form.formPropsRef?.current?.mode
    const error = formState.errors[name]
    const errorType = error?.type

    if (errorType === 'forced') {
      return {
        isInvalid: true,
        errorText: error?.message?.toString()
      }
    }

    if (mode === 'onSubmit' && formState.submitCount === 0) {
      return {}
    }
    if (mode !== 'onSubmit' && !formState.dirtyFields[name]) {
      return {}
    }

    if (error) {
      return {
        isInvalid: true,
        errorText: error.message?.toString()
      }
    }
    return {}
  }, [formState])

  return errors
}
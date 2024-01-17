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
    const mode = form.formPropsRef?.current?.mode
    const error = formState.errors[name]

    if (mode === 'onSubmit' && formState.submitCount === 0) {
      return {}
    }

    if (!formState.dirtyFields[name]) {
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
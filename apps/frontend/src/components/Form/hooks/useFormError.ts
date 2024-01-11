import { useCallback, useMemo } from "react";
import type { FormState } from "react-hook-form";


export default function useFormError<T extends FormState<any>>(formState: T) {

  const getError = useCallback((name: keyof T['errors']) => {
    const error = formState.errors[name]
    if (error) {
      return {
        isInvalid: true,
        errorText: error.message?.toString()
      }
    }
    return {}
  }, [formState])

  return {
    getError
  }
}
import { Path, UseFormProps, useForm, type FieldValues } from "react-hook-form"
import { BaseSyntheticEvent, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "./useFormContext"

export type FormStepSubmitHandler<T = any> = (
  data: T,
  e?: BaseSyntheticEvent<object, any, any>
) => Promise<boolean>

export const useFormStep = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(props?: UseFormProps<TFieldValues, TContext>) => {
  const {
    stepIndex,
    subStepIndex,
    subscribe,
    unsubscribe,
  } = useFormContext()

  const form = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    ...props,
  })

  const formRef = useRef<HTMLFormElement>(null)
  const isSubscribed = useRef(false)

  subscribe(stepIndex, subStepIndex, form, formRef)

  useEffect(() => {
    if (!isSubscribed.current) {
      isSubscribed.current = true
      return
    }
    return () => {
      isSubscribed.current = false
      unsubscribe(stepIndex, subStepIndex)
    }
  }, [])

  const handleSubmit = useCallback((onSubmit: FormStepSubmitHandler) => {
    return form.handleSubmit(async (data, event) => {
      let result = null
      try {
        result = await onSubmit(data, event)
      } catch (error) {
        result = error
      }

      formRef?.current?.dispatchEvent(new CustomEvent('afterSubmit', {
        detail: result
      }))
    })
  }, [])

  const setErrors = useCallback((errors: Array<{ key: string, message: string }>) => {

    for (const error of errors) {
      form.setError(error.key as Path<TFieldValues>, {
        message: error.message,
      })
    }

  }, [])

  return {
    ...form,
    handleSubmit,
    setErrors,
    formRef,
  }
}
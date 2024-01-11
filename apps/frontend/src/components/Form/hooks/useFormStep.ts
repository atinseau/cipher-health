import { UseFormProps, useForm, type FieldValues } from "react-hook-form"
import { useEffect, useRef } from "react"
import { useFormContext } from "./useFormContext"

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

  return {
    ...form,
    handleSubmit: (onSubmit: any) => {
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
    },
    formRef
  }
}
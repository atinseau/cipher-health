import { Path, UseFormProps, useForm, type FieldValues } from "react-hook-form"
import { BaseSyntheticEvent, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "./useFormContext"
import type { SubmissionHistory } from "../contexts/FormProvider"

export type FormStepSubmitHandler<T = any> = (
  data: T,
  submissionHistory?: SubmissionHistory,
  e?: BaseSyntheticEvent<object, any, any>,
) => Promise<boolean>

export function useFormStep<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(props?: UseFormProps<TFieldValues, TContext>) {
  const {
    stepIndex,
    subStepIndex,
    subscribe,
    unsubscribe,
    submissionHistory,
    onSubmitCallback,
    setStepIndex,
    setSubStepIndex,
  } = useFormContext()

  // We need to find the submission history for the current step
  // to know if there is initial errors to display or not.
  const currentSubmission = submissionHistory.find((step) => {
    return step.stepIndex === stepIndex && step.subStepIndex === subStepIndex
  })

  const formPropsRef = useRef<UseFormProps<TFieldValues, TContext>>({
    mode: currentSubmission?.errors ? 'onChange' : 'onSubmit',
    reValidateMode: 'onChange',
    ...props,
  })

  const form = useForm(formPropsRef.current)
  const formRef = useRef<HTMLFormElement>(null)
  const isSubscribed = useRef(false)

  subscribe(
    stepIndex,
    subStepIndex,
    form,
    formRef,
    formPropsRef
  )

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

  useEffect(() => {
    // Restoring errors from submission history (when we come back to a non current step)
    if (currentSubmission && currentSubmission.errors) {
      setErrors(currentSubmission.errors, true)
    }
    // removing errors from submission history
    delete currentSubmission?.errors
  }, [form])

  const handleSubmit = useCallback((onSubmit: FormStepSubmitHandler) => {
    return form.handleSubmit(async (data, event) => {
      const isExternalSubmission: boolean = (event?.nativeEvent as CustomEvent)?.detail?.external || false

      let result: boolean | Error | null = null
      try {
        result = await onSubmit(data, submissionHistory, event)
      } catch (error) {
        result = error
      }

      const contextResult = result === false || result instanceof Error ? result : data

      // If there is an error or the submit handler returns false, we don't want to
      // go to the next step. We just want to display the error.
      // in other cases, we go to the next step and return the submitted data.
      if (isExternalSubmission) {
        formRef?.current?.dispatchEvent(new CustomEvent('afterSubmit', {
          detail: contextResult,
        }))
      } else {
        onSubmitCallback(contextResult)
      }
    })
  }, [])

  const setErrors = useCallback((errors: Array<{ key: string, message: string }>, forceDisplay?: boolean) => {
    for (const error of errors) {

      const errorStep = submissionHistory.find((step) => {
        return Object.keys(step.data).includes(error.key)
      })

      // If the error is not in the current step, we need to go to the step where the error is
      // so we keep the errors in the submission history and when the previous step is rendered
      // we re run this function to display the error.
      if (errorStep && (errorStep.stepIndex !== stepIndex || errorStep.subStepIndex !== subStepIndex)) {
        console.log(errorStep)
        setStepIndex(errorStep.stepIndex)
        setSubStepIndex(errorStep.subStepIndex)
        errorStep.errors = errors
        return
      }

      form.setError(error.key as Path<TFieldValues>, {
        message: error.message,
        type: forceDisplay ? 'forced' : undefined
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
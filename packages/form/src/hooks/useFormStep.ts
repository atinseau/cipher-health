import { DefaultValues, Path, UseFormProps, useForm, type FieldValues } from "react-hook-form"
import { BaseSyntheticEvent, useCallback, useEffect, useRef } from "react"
import { useFormContext } from "./useFormContext"
import type { SubmissionHistory } from "../contexts/FormProvider"

import { useMount } from '@cipher-health/utils/react'

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
    addNewSubmissionHistory,
    getCurrentSubmission
  } = useFormContext()

  const formPropsRef = useRef<UseFormProps<TFieldValues, TContext>>({
    mode: getCurrentSubmission()?.errors ? 'onChange' : 'onSubmit',
    reValidateMode: 'onChange',
    ...props,
    // override defaultValues with the current submission data (if any)
    defaultValues: (getCurrentSubmission()?.data || props?.defaultValues || {}) as DefaultValues<TFieldValues>,
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

  useMount(() => {
    const currentSubmission = getCurrentSubmission()

    // Restoring errors from submission history (when we come back to a non current step)
    if (currentSubmission && currentSubmission.errors) {
      setErrors(currentSubmission.errors, true)
    }
  })

  const handleSubmit = useCallback((onSubmit: FormStepSubmitHandler) => {
    return form.handleSubmit(async (data, event) => {

      // We add the current step to the submission history
      // This is useful to restore errors when we come back to a non current step
      // Even if the form is not submitted, we want to keep the data
      addNewSubmissionHistory(data)

      const isExternalSubmission: boolean = (event?.nativeEvent as CustomEvent)?.detail?.external || false
      let result: boolean | Error | null = null
      try {
        result = await onSubmit(data, submissionHistory, event)
      } catch (error) {
        result = error
      }
      const contextResult = {
        result,
        data
      }

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


  const setErrors = useCallback((errors: Array<{ key: string, message: string }> | Record<string, string>, forcedDisplay?: boolean) => {
    if (!errors) {
      return
    }

    if (typeof errors === 'object' && Array.isArray(errors)) {
      for (const error of errors) {
        const { key, message } = error
        const concernedErrorStep = submissionHistory.find((step) => {
          return Object.keys(step.data).includes(key)
        })

        if (concernedErrorStep && (!concernedErrorStep.errors || !concernedErrorStep.errors[key])) {
          concernedErrorStep.errors = concernedErrorStep.errors || {}
          concernedErrorStep.errors[key] = message
        }
      }
    }

    for (const step of submissionHistory) {

      const errors = Object.entries(step?.errors || {})

      // Current step
      if (errors?.length && step.stepIndex === stepIndex && step.subStepIndex === subStepIndex) {
        errors.forEach(([key, message]) => {
          form.setError(key as Path<TFieldValues>, {
            type: forcedDisplay ? 'forced' : undefined,
            message: message
          })
        })
        return
      }

      // Other steps
      if (errors.length) {
        setStepIndex(step.stepIndex)
        setSubStepIndex(step.subStepIndex)
        return
      }
    }

  }, [])

  return {
    ...form,
    handleSubmit,
    setErrors,
    formRef,
  }
}
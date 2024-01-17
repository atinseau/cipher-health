'use client';

import React, { createContext, useCallback, useMemo, useRef, useState } from "react";
import { UseFormProps, UseFormReturn } from "react-hook-form";

export type FormStep = {
  title?: string
  components: React.ComponentType[]
}

export type BeforeStepChangeHandler = (stepIndex: number, subStepIndex?: number) => Promise<any> | any

type FormProviderProps = {
  children: React.ReactNode
  initialStepIndex?: number
  initialSubStepIndex?: number
  steps: FormStep[]
  onError?: (error: Error) => void
  beforeStepChange?: BeforeStepChangeHandler
}

type FormRefs = Record<number, Record<number,
  & UseFormReturn
  & {
    formRef?: React.RefObject<HTMLFormElement>,
    formPropsRef?: React.RefObject<UseFormProps<any, any>>
  }
>>

export type SubmissionHistory = Array<{
  data: Record<string, any>
  stepIndex: number
  subStepIndex: number
}>

type FormContextSubscribe = (
  stepIndex: number,
  subStepIndex: number,
  form: UseFormReturn<any, any, any>,
  formRef: React.RefObject<HTMLFormElement>,
  formPropsRef: React.RefObject<UseFormProps<any, any>>
) => void

type IFormContext = {
  stepIndex: number
  subStepIndex: number
  steps: FormStep[]
  onSubmit: () => void
  onSubmitCallback: (result: Record<string, any> | false | Error) => void
  Component: React.ComponentType
  submissionHistory: SubmissionHistory
  getForm: (stepIndex: number, subStepIndex: number) => FormRefs[number][number]
  subscribe: FormContextSubscribe
  unsubscribe: (stepIndex: number, subStepIndex: number) => void
}

export const FormContext = createContext({} as IFormContext)

export function FormProvider(props: FormProviderProps) {

  const {
    children,
    steps,
    initialStepIndex = 0,
    initialSubStepIndex = 0,
    beforeStepChange,
  } = props

  const [stepIndex, setStepIndex] = useState(initialStepIndex)
  const [subStepIndex, setSubStepIndex] = useState(initialSubStepIndex)

  const formRefs = useRef<FormRefs>({})
  const submissionHistoryRef = useRef<SubmissionHistory>([])

  const getForm = useCallback((si: number, ssi: number) => {
    return formRefs.current?.[si]?.[ssi]
  }, [formRefs])

  const changeStep = useCallback(async (stepConfig: { si: number, ssi?: number }) => {
    const {
      si,
      ssi
    } = stepConfig

    if (si === stepIndex && ssi === subStepIndex) {
      return
    }
    const beforeStepChangeResult = await beforeStepChange?.(si, ssi)
    if (!beforeStepChangeResult) {
      console.warn('[FormProvider] beforeStepChange returned false, cannot change step')
      return
    }
    setStepIndex(si)
    if (typeof ssi !== 'undefined') { // 0 is a valid value
      setSubStepIndex(ssi)
    }
  }, [
    beforeStepChange,
    stepIndex,
    subStepIndex,
  ])

  const onSubmitCallback = useCallback(async (result: Record<string, any> | false | Error) => {
    if (result instanceof Error) {
      props.onError?.(result)
      return
    }
    if (!result) {
      console.warn('[FormProvider] Form submission was cancelled: ', result)
      return
    }

    // Update submission history
    submissionHistoryRef.current.push({
      data: result,
      stepIndex,
      subStepIndex,
    })

    if (subStepIndex < steps[stepIndex].components.length - 1) {
      changeStep({
        si: stepIndex, // same step
        ssi: subStepIndex + 1
      })
      return
    }

    if (stepIndex < steps.length - 1) {
      changeStep({
        si: stepIndex + 1, // next step
        ssi: 0, // first substep
      })
      return
    }
  }, [stepIndex, subStepIndex])

  // This function is only for triggering the submit event externally
  // that's mean the click event is not triggered inside the <form/> component step
  // but outside, for example:
  // <>
  //  <Form/>
  //  <ExternalButton/> <-- By getting the context, we can trigger the submit event
  // </>
  const onSubmit = useCallback(async () => {
    const { formRef } = getForm(stepIndex, subStepIndex)

    if (!formRef?.current) {
      console.error('[FormProvider] Form ref is not defined cannot submit form')
      return
    }

    formRef.current?.dispatchEvent(new CustomEvent('submit', {
      cancelable: true,
      bubbles: true,
      detail: {
        external: true
      }
    }))

    formRef.current?.addEventListener('afterSubmit', (e) => {
      onSubmitCallback((e as CustomEvent).detail)
    }, {
      once: true
    })
  }, [stepIndex, subStepIndex])

  const Component = useMemo(() => {
    const step = steps[stepIndex]
    const component = step.components[subStepIndex]

    return component
  }, [
    stepIndex,
    subStepIndex,
  ])

  const subscribe: FormContextSubscribe = useCallback((si, ssi, form, formRef, formPropsRef) => {
    formRefs.current[si] = {
      ...formRefs.current[si],
      [ssi]: {
        ...form,
        formRef,
        formPropsRef,
      }
    }
  }, [])

  const unsubscribe = useCallback((si: number, ssi: number) => {
    delete formRefs.current[si][ssi]
  }, [])

  return <FormContext.Provider value={{
    stepIndex,
    subStepIndex,
    submissionHistory: submissionHistoryRef.current,
    steps,
    onSubmit,
    onSubmitCallback,
    getForm,
    subscribe,
    unsubscribe,
    Component,
  }}>
    {children}
  </FormContext.Provider>
}
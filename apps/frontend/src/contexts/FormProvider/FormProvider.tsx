'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { UseFormReturn } from "react-hook-form";

export type FormStep = {
  title: string
  components: React.ComponentType[]
}

type FormProviderProps = {
  children: React.ReactNode
  steps: FormStep[]
}

type FormRefs = Record<number, Record<number,
  & UseFormReturn
  & {
    formRef?: React.RefObject<HTMLFormElement>
  }
>>

type FormContextSubscribe = (
  stepIndex: number,
  subStepIndex: number,
  form: UseFormReturn<any, any, any>,
  formRef: React.RefObject<HTMLFormElement>
) => void

type IFormContext = {
  stepIndex: number
  subStepIndex: number
  steps: FormStep[]
  onSubmit: () => void
  Component: React.ComponentType

  getForm: (stepIndex: number, subStepIndex: number) => UseFormReturn<any, any, any>
  subscribe: FormContextSubscribe
  unsubscribe: (stepIndex: number, subStepIndex: number) => void
}

export const FormContext = createContext({} as IFormContext)

export default function FormProvider(props: FormProviderProps) {

  const { children, steps } = props

  const [stepIndex, setStepIndex] = useState(0)
  const [subStepIndex, setSubStepIndex] = useState(0)

  const formRefs = useRef<FormRefs>({})

  const getForm = useCallback((si: number, ssi: number) => {
    return formRefs.current?.[si]?.[ssi]
  }, [formRefs])

  const dispatchSubmit = useCallback(() => {
    const { formRef } = getForm(stepIndex, subStepIndex)

    if (!formRef?.current) {
      console.warn('formRef.current is null')
      return
    }

    formRef.current?.dispatchEvent(new Event('submit', {
      cancelable: true,
      bubbles: true,
    }))

    return new Promise<any>((resolve, reject) => {
      formRef.current?.addEventListener('afterSubmit', (e) => {
        const { detail } = e as CustomEvent
        if (detail instanceof Error) {
          reject(detail)
          return
        }
        resolve(detail)
      }, {
        once: true
      })
    })
  }, [stepIndex, subStepIndex])

  const onSubmit = useCallback(async () => {
    const { formRef } = getForm(stepIndex, subStepIndex)
    const result = await dispatchSubmit()

    if (result === false) {
      console.log('error')
      return
    }
    console.log('success')

    // if (subStepIndex < steps[stepIndex].components.length - 1) {
    //   setSubStepIndex(subStepIndex + 1)
    //   return
    // }

    // if (stepIndex < steps.length - 1) {
    //   setStepIndex(stepIndex + 1)
    //   setSubStepIndex(0)
    //   return
    // }
  }, [stepIndex, subStepIndex])

  const Component = useMemo(() => {
    const step = steps[stepIndex]
    const component = step.components[subStepIndex]

    return component
  }, [
    stepIndex,
    subStepIndex,
  ])

  const subscribe: FormContextSubscribe = useCallback((si, ssi, form, formRef) => {
    formRefs.current[si] = {
      ...formRefs.current[ssi],
      [subStepIndex]: {
        ...form,
        formRef
      }
    }
  }, [])

  const unsubscribe = useCallback((si: number, ssi: number) => {
    delete formRefs.current[si][ssi]
  }, [])

  return <FormContext.Provider value={{
    stepIndex,
    subStepIndex,
    steps,
    onSubmit,
    getForm,
    subscribe,
    unsubscribe,
    Component,
  }}>
    {children}
  </FormContext.Provider>
}
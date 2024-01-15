'use client';

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { UseFormReturn } from "react-hook-form";
import useNotify from "../NotificationProvider/hooks/useNotify";

export type FormStep = {
  title: string
  components: React.ComponentType[]
}

export type BeforeStepChangeHandler = (stepIndex: number, subStepIndex?: number) => Promise<any> | any

type FormProviderProps = {
  children: React.ReactNode
  initialStepIndex?: number
  initialSubStepIndex?: number
  steps: FormStep[]
  beforeStepChange?: BeforeStepChangeHandler
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

  const notify = useNotify()

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

    return new Promise<boolean>((resolve) => {
      formRef.current?.addEventListener('afterSubmit', (e) => {
        const { detail } = e as CustomEvent
        if (detail instanceof Error) {
          notify({
            title: 'Une erreur est survenue',
            message: detail.message,
            type: 'error',
          })
          resolve(false)
          return
        }
        resolve(detail)
      }, {
        once: true
      })
    })
  }, [stepIndex, subStepIndex])

  const onSubmit = useCallback(async () => {
    const result = await dispatchSubmit()

    if (!result) {
      console.warn('[FormProvider] Step change was prevented by onSubmit handler')
      return
    }

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
      ...formRefs.current[si],
      [ssi]: {
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
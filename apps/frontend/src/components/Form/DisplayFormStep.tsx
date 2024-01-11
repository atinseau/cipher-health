import { useFormContext } from "./hooks/useFormContext"

type DisplayFormStepProps = {

}

export default function DisplayFormStep() {
  const { Component } = useFormContext()
  return <Component />
}
import { useFormContext } from "./hooks/useFormContext"

export default function DisplayFormStep() {
  const { Component } = useFormContext()
  if (!Component) {
    throw new Error("No component to display")
  }
  return <Component />
}
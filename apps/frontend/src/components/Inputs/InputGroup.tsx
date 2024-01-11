import BaseInput, { BaseInputProps } from "./BaseInput";

type InputGroupProps = {
  children: React.ReactNode
  baseInputProps?: BaseInputProps
  className?: string
}

export default function InputGroup(props: InputGroupProps) {

  const {
    children,
    className,
    baseInputProps
  } = props

  return <BaseInput {...baseInputProps}>
    <div className={className}>
      {children}
    </div>
  </BaseInput>

}
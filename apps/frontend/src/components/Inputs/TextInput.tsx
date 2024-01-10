import BaseInput, { BaseInputProps } from "./BaseInput";
import { forwardRef } from "react";
import Input, { InputProps } from "../Input";

export type TextInputProps = InputProps & {
  baseInputProps?: BaseInputProps
}


const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {

  const {
    baseInputProps,
    ...inputProps
  } = props

  return <BaseInput {...baseInputProps} isRequired={inputProps?.isRequired}>
    <Input
      {...inputProps}
      ref={ref}
    />
  </BaseInput>
})

export default TextInput
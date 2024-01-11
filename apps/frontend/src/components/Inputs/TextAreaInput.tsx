import Textarea, { TextareaProps } from "../Textarea";
import BaseInput, { BaseInputProps } from "./BaseInput";

type TextAreaInputProps = TextareaProps & {
  baseInputProps?: BaseInputProps
}

export default function TextAreaInput(props: TextAreaInputProps) {

  const {
    baseInputProps,
    ...inputProps
  } = props

  return <BaseInput
    {...baseInputProps}
    isRequired={inputProps?.isRequired}
  >
    <Textarea {...inputProps} />
  </BaseInput>

}
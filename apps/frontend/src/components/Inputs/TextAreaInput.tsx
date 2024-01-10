import { TextAreaProps, Textarea } from "@nextui-org/input";
import BaseInput, { BaseInputProps } from "./BaseInput";

type TextAreaInputProps = BaseInputProps & TextAreaProps & {

}

export default function TextAreaInput(props: TextAreaInputProps) {

  const {
    label,
    ...inputProps
  } = props

  return <BaseInput {...inputProps} label={label} isRequired={props.required || props.isRequired}>
    <Textarea
      placeholder={inputProps.placeholder}
      disableAnimation
      disableAutosize
      classNames={{
        base: "max-w-xs",
        inputWrapper: [
          "bg-white shadow-none rounded-sm border border-indigo-500",
          "data-[hover=true]:bg-indigo-300",
          "group-data-[focus=true]:bg-indigo-200",
          "group-data-[disabled=true]:bg-gray-300 group-data-[disabled=true]:border-gray-600",
          "group-data-[invalid=true]:border-danger group-data-[invalid=true]:bg-danger/5"
        ],
        input: [
          "resize-y min-h-[40px]",
          "group-data-[invalid=true]:!text-black",
          "placeholder:text-indigo-400 group-data-[disabled=true]:placeholder:text-gray-600 group-data-[invalid=true]:placeholder:text-danger"
        ],
      }}
      {...inputProps}
    />
  </BaseInput>

}
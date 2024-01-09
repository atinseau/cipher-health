import { Input, InputProps } from "@nextui-org/input";
import BaseInput, { BaseInputProps } from "./BaseInput";

export type TextInputProps =
  & BaseInputProps
  & InputProps
  & {
    inputRef?: React.Ref<HTMLInputElement>
  }

export default function TextInput(props: TextInputProps) {

  const {
    label,
    ...inputProps
  } = props

  return <BaseInput {...inputProps} label={label} required={props.required || props.isRequired}>
    <Input
      {...inputProps || {}}
      classNames={{
        innerWrapper: "h-[42px]",
        inputWrapper: [
          "h-fit py-0",
          "bg-white shadow-none rounded-sm border border-indigo-500",
          "data-[hover=true]:bg-indigo-300",
          "group-data-[focus=true]:bg-indigo-200",
          "group-data-[disabled=true]:bg-gray-300 group-data-[disabled=true]:border-gray-600",
          "group-data-[invalid=true]:border-danger group-data-[invalid=true]:bg-danger/5",
        ],
        input: [
          "text-base",
          "group-data-[invalid=true]:!text-black",
          "placeholder:text-indigo-400 group-data-[disabled=true]:placeholder:text-gray-600 group-data-[invalid=true]:placeholder:text-danger"
        ],
      }}
      endContent={!inputProps.isClearable && inputProps.endContent}
      type="text"
      ref={props.inputRef}
    />
  </BaseInput>
}
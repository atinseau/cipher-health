import { Input, InputProps } from "@nextui-org/input";
import BaseInput, { BaseInputProps } from "./BaseInput";
import { forwardRef } from "react";
import clsx from "clsx";

export type TextInputProps =
  & BaseInputProps
  & InputProps
  & {
    inputRef?: React.Ref<HTMLInputElement>
  }


const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {

  const {
    label,
    classNames,
    ...inputProps
  } = props

  return <BaseInput {...inputProps} label={label} required={props.required || props.isRequired}>
    <Input
      classNames={{
        innerWrapper: "h-[42px] pb-0",
        inputWrapper: clsx(classNames?.inputWrapper, [
          "h-fit py-0",
          "bg-white shadow-none rounded-sm border border-indigo-500",
          "data-[hover=true]:bg-indigo-300",
          "group-data-[focus=true]:bg-indigo-200",
          "group-data-[disabled=true]:bg-gray-300 group-data-[disabled=true]:border-gray-600",
          "group-data-[invalid=true]:border-danger group-data-[invalid=true]:bg-danger/5",
        ]),
        input: [
          "text-base h-full",
          "group-data-[invalid=true]:!text-black",
          "placeholder:text-indigo-400 group-data-[disabled=true]:placeholder:text-gray-600 group-data-[invalid=true]:placeholder:text-danger"
        ],
      }}
      endContent={!inputProps.isClearable && inputProps.endContent}
      type="text"
      {...inputProps || {}}
      ref={ref}
    />
  </BaseInput>
})

export default TextInput
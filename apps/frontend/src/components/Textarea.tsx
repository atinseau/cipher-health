import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from "react";
import Input, { InputContainer, InputContainerProps } from "./Input";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";


export type TextareaProps =
  & Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    | 'disabled'
    | 'ref'
    | 'required'
  >
  & Omit<InputContainerProps,
    | 'children'
    | 'startContent'
    | 'endContent'
    | 'className'
  >

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {

  const {
    errorText,
    isInvalid,
    isRequired,
    isDisabled,
    ...textareaProps
  } = props

  return <InputContainer
    errorText={errorText}
    isInvalid={isInvalid}
    isRequired={isRequired}
    isDisabled={isDisabled}
  >
    <textarea
      {...textareaProps}
      disabled={isDisabled}
      required={isRequired}
      className={twMerge(
        "pt-2.5 mb-2 bg-transparent outline-none w-full text-base",
        "placeholder:text-indigo-400",
        clsx({
          "placeholder:text-gray-600": isDisabled,
          "placeholder:text-danger": isInvalid
        })
      )}
      ref={ref}
    >

    </textarea>
  </InputContainer>

})


export default Textarea
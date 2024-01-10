import clsx, { ClassValue } from "clsx"
import { DetailedHTMLProps, ForwardedRef, InputHTMLAttributes, forwardRef } from "react"
import { twMerge } from "tailwind-merge"


export type InputProps =
  & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    | 'disabled'
    | 'ref'
    | 'className'
    | 'required'
  >
  & {
    errorText?: string
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    isInvalid?: boolean
    isRequired?: boolean
    isDisabled?: boolean
    ref?: ForwardedRef<HTMLInputElement>
    classNames?: {
      base?: ClassValue[] | ClassValue
      input?: ClassValue[] | ClassValue
    }
  }


const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {

  const {
    endContent,
    startContent,
    isRequired,
    isDisabled,
    isInvalid,
    errorText,
    classNames,
    ...inputProps
  } = props

  return <div className="flex flex-col gap-2">
    <div className={twMerge([
      "group",
      "transition-background",
      "border items-center rounded-sm border-indigo-500 flex px-2.5",
      clsx(classNames?.base, {
        "hover:bg-indigo-300 focus-within:bg-indigo-200 focus-within:hover:bg-indigo-200": !isDisabled && !isInvalid,
        "border-gray-600 bg-gray-300": isDisabled,
        "bg-danger border-danger bg-opacity-5": isInvalid
      })
    ])}>
      {startContent}
      <input
        {...inputProps}
        disabled={isDisabled}
        required={isRequired}
        className={twMerge([
          "h-[42px] w-full outline-none bg-transparent font-roboto",
          "placeholder:text-indigo-400",
          clsx(classNames?.input, {
            "placeholder:text-gray-600": isDisabled,
            "placeholder:text-danger": isInvalid
          })
        ])}
        ref={ref}
      />
      {endContent}
    </div>
    {isInvalid && errorText && <p className="text-danger text-sm">{errorText}</p>}
  </div>

})


export default Input
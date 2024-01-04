import { Button as NextUIButton, ButtonProps as NextUIButtonProps } from '@nextui-org/button'
import classNames from 'classnames'

type ButtonProps = Omit<NextUIButtonProps, 'color'> & {
  children: React.ReactNode
}

export default function Button(props: ButtonProps) {

  const {
    children,
    className,
    ...buttonProps
  } = props


  return <NextUIButton {...buttonProps} className={classNames(className, "rounded-lg text-white py-[10px]", {
    "bg-indigo-500 data-[disabled=true]:bg-gray-500 opacity-100": buttonProps.variant === "solid",
    "border-[2px] border-indigo-500 bg-white text-indigo-500": buttonProps.variant === "bordered"
  })}>
    {children}
  </NextUIButton>


}
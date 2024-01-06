import { createVariants, pickVariant } from '@/utils/variants'
import {
  Button as NextUIButton,
  ButtonProps as NextUIButtonProps
} from '@nextui-org/button'
import classNames from 'classnames'

const buttonVariants = createVariants<NextUIButtonProps>({
  "filled": {
    className: "text-white rounded-lg",
    colors: {
      "primary": {
        default: "bg-indigo-500",
        disabled: "bg-gray-600",
        hover: "bg-indigo-600 opacity-100"
      },
      "secondary": [
        "bg-indigo-300 text-indigo-500",
        "data-[disabled=true]:bg-gray-400 data-[disabled=true]:text-gray-600 data-[disabled=true]:opacity-100",
        "data-[hover=true]:bg-indigo-400 data-[hover=true]:text-white"
      ]
    }
  },
  "outlined": {
    className: "rounded-lg",
    colors: {
      "primary": [
        "bg-white border border-indigo-500 text-indigo-500 border-[2px]",
        "data-[disabled=true]:border-gray-500 data-[disabled=true]:text-gray-500 data-[disabled=true]:opacity-100",
        "data-[hover=true]:border-indigo-600 data-[hover=true]:text-indigo-600 data-[hover=true]:opacity-100",
      ],
    }
  },
  "plain": {
    props: {
      disableAnimation: true,
    },
    colors: {
      "primary": [
        "text-indigo-500 bg-transparent underline underline-offset-4",
        "data-[disabled=true]:text-gray-600 data-[disabled=true]:opacity-100",
        "data-[hover=true]:text-indigo-600 data-[hover=true]:opacity-100"
      ],
    }
  },
})


type ButtonProps<T extends keyof typeof buttonVariants> = Omit<NextUIButtonProps, 'variant' | 'color'> & {
  children: React.ReactNode
  variant?: T
  color?: keyof typeof buttonVariants[T]['colors']
}


export default function Button<T extends keyof typeof buttonVariants>(props: ButtonProps<T>) {

  const {
    children,
    className,
    variant = "filled",
    color = "primary",
    ...buttonProps
  } = props

  const {
    className: variantClassName,
    props: variantProps
  } = pickVariant(buttonVariants, variant, color as string)

  return <NextUIButton {...buttonProps} {...variantProps} className={classNames(
    className,
    variantClassName
  )}>
    {children}
  </NextUIButton>


}
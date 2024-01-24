import clsx from "clsx"
import { HTMLAttributes, createElement } from "react"
import { twMerge } from "tailwind-merge"

type PageItemProps = HTMLAttributes<any> & {
  children: React.ReactNode
  autoSpacing?: boolean
  fullWidth?: boolean
  limitless?: boolean
  as?: keyof JSX.IntrinsicElements
}

export default function PageItem(props: PageItemProps) {

  const {
    children,
    className,
    autoSpacing,
    limitless = false,
    fullWidth,
    ...rest
  } = props

  return createElement(props.as || 'div', {
    className: twMerge(clsx(
      "w-full",
      className, {
      "px-6 md:px-20": !fullWidth,
      "mt-8 md:mt-24": autoSpacing,
      "max-w-[1440px]": !limitless,
    })),
    children: props.children,
    ...rest
  })
}
import { HTMLAttributes, createElement } from "react"
import { twMerge } from "tailwind-merge"

type PageItemProps = HTMLAttributes<any> & {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

export default function PageItem(props: PageItemProps) {

  const { children, className, ...rest } = props

  return createElement(props.as || 'div', {
    className: twMerge("max-w-[1440px] px-6 md:px-20", className),
    children: props.children,
    ...rest
  })
}
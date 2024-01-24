import { createElement } from "react"

export type TagProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & {
  as: T
}

export default function Tag<T extends keyof JSX.IntrinsicElements>({ as, children, ...rest }: TagProps<T>) {
  return createElement(as, {
    children,
    ...rest
  })
}
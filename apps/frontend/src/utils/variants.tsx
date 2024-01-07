import classNames from "classnames"
import { ComponentProps } from "react"

type Colors<Key extends string | number | symbol = string> = Record<Key, string | string[]>

type Variant<ComponentProps> = {
  className?: string
  props?: Partial<ComponentProps>
  colors: ComponentProps extends { classNames?: infer T }
  ? (
    T extends Record<string, any>
    ? Record<string, Partial<Colors<keyof T>>>
    : Colors
  )
  : Colors
}


export const prefixClassName = (className: string, prefix: string) => {
  return className.split(' ').map(className => `${prefix}${className}`).join(' ')
}

// TODO: impl raw variant creation to be used with pickVariant manually
// export function createVariants() {

// }

export function extendsVariants<
  ReactComponent extends React.ElementType,
  T extends Record<string, Variant<ComponentProps<ReactComponent>>> = Record<string, Variant<ComponentProps<ReactComponent>>>,
  OptionVariant extends keyof T = keyof T,
>(
  Component: ReactComponent,
  variants: T,
  options?: {
    defaultVariant?: OptionVariant,
    defaultColor?: keyof T[OptionVariant]['colors'],
  }
) {

  return <V extends keyof T>(props: Omit<ComponentProps<ReactComponent>, 'variant' | 'color'> & {
    variant?: V
    color?: keyof T[V]['colors'],
  }) => {

    const {
      variant = options?.defaultVariant,
      color = options?.defaultColor,
      className,
      ...rest
    } = props

    const {
      className: variantClassName,
      props: variantProps,
      classNames: colorClassNames,
    } = pickVariant(variants, variant as string, color as string)

    return <Component
      {...rest as any}
      {...variantProps}
      className={classNames(className, variantClassName)}
      classNames={colorClassNames}
    />
  }

  // return variants
}

export const pickVariant = (variants: Record<string, Variant<{} | { classNames?: Record<string, string> }>>, variant: string, color: string) => {

  const variantObject = variants[variant]
  const colorObject = variantObject?.colors[color]

  const colorClassName = typeof colorObject === 'string' || Array.isArray(colorObject) ? colorObject : undefined
  const colorClassNames = !(typeof colorObject === 'string') && !Array.isArray(colorObject) ? colorObject : undefined

  const variantClassName = variantObject?.className
  const variantProps = variantObject?.props

  return {
    className: classNames(variantClassName, colorClassName),
    classNames: colorClassNames,
    props: variantProps
  }

}
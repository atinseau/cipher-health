import classNames from "classnames"
import { ComponentProps } from "react"

type Color = string | string[]

type Variant<ComponentProps> = {
  className?: string
  classNames?: Record<string, Color>
  props?: Partial<ComponentProps>
  colors: ComponentProps extends { classNames?: infer T }
  ? (
    T extends Record<string, any>
    ? Record<string, Partial<Record<keyof T, Color>>> & { primary: Partial<Record<keyof T, Color>> }
    : Record<string, Color | Record<string, Color>> & { primary: Color | Record<string, Color> }
  )
  : Record<string, Color | Record<string, Color>> & { primary: Color | Record<string, Color> }
}

// TODO: impl raw variant creation to be used with pickVariant manually
export function createVariants<
  T extends Record<string, Variant<{}>> = Record<string, Variant<{}>>,
>(variants: T) {
  return variants
}

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
    } = pickVariant(variants, variant as V, color as keyof T[V]['colors'])

    return <Component
      {...rest as any}
      {...variantProps}
      className={classNames(className, variantClassName)}
      classNames={colorClassNames}
    />
  }

  // return variants
}

export function pickVariant<
  T extends Record<string, Variant<any>>,
  K extends keyof T,
  C extends keyof T[K]['colors'],
>(variants: T, variant: K, color: C) {

  const variantObject = variants[variant]
  const colorObject = variantObject?.colors[color as string]

  const colorClassName = typeof colorObject === 'string' || Array.isArray(colorObject) ? colorObject : undefined
  const colorClassNames = !(typeof colorObject === 'string') && !Array.isArray(colorObject) ? colorObject : {}


  const variantClassName = variantObject?.className
  const variantClassNames = variantObject?.classNames || {}
  const variantProps = variantObject?.props

  const mergedClassNames = {
    ...variantClassNames
  }

  for (const [key, value] of Object.entries(colorClassNames)) {
    if (mergedClassNames[key]) {
      mergedClassNames[key] = classNames(mergedClassNames[key], value)
    } else {
      mergedClassNames[key] = value
    }
  }

  return {
    className: classNames(variantClassName, colorClassName),
    classNames: mergedClassNames,
    props: variantProps
  }

}
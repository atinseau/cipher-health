import classNames from "classnames"

type Color = string | string[] | {
  default?: string | string[]
  disabled?: string | string[]
  hover?: string | string[]
}

type Variant<ComponentProps = {}> = {
  className?: string
  props?: Partial<ComponentProps>
  colors: Record<string, Color>
}

export const prefixClassName = (className: string, prefix: string) => {
  return className.split(' ').map(className => `${prefix}${className}`).join(' ')
}

export function createVariants<ComponentProps, T extends Record<string, Variant<ComponentProps>> = Record<string, Variant<ComponentProps>>>(variants: T) {

  const correctedVariants = structuredClone(variants)

  for (const variant in correctedVariants) {
    const variantObject = correctedVariants[variant]

    for (const color in variantObject.colors) {
      const colorObject = variantObject.colors[color]

      if (typeof colorObject === 'object') {

        if ('hover' in colorObject && colorObject.hover) {
          const hoverAsString = Array.isArray(colorObject.hover) ? colorObject.hover.join(' ') : colorObject.hover
          colorObject.hover = prefixClassName(hoverAsString, 'data-[hover=true]:')
        }

        if ('disabled' in colorObject && colorObject.disabled) {
          const disabledAsString = Array.isArray(colorObject.disabled) ? colorObject.disabled.join(' ') : colorObject.disabled
          colorObject.disabled = prefixClassName(disabledAsString, 'data-[disabled=true]:')
        }
      }
    }
  }
  return correctedVariants
}

export const pickVariant = (variants: Record<string, Variant>, variant: string, color: string) => {

  const variantObject = variants[variant]
  const colorObject = variantObject.colors[color]

  const variantClassName = variantObject.className
  const variantProps = variantObject.props

  let colorClassName: string

  if (!Array.isArray(colorObject) && typeof colorObject === 'object') {
    colorClassName = classNames(colorObject.default, colorObject.disabled, colorObject.hover)
  } else {
    colorClassName = classNames(colorObject)
  }

  return {
    className: classNames(variantClassName, colorClassName),
    props: variantProps
  }

}
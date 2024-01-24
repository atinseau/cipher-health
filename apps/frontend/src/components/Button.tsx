'use client';

import { createVariants, pickVariant } from '@/utils/variants'
import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEvent, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'

import { Ripple, useRipple } from "@nextui-org/ripple"
import Tag from './Tag';

const buttonVariants = createVariants({
  "filled": {
    className: "text-white rounded-lg",
    colors: {
      "primary": [
        "bg-indigo-500",
        "disabled:bg-gray-500",
        "hover:bg-indigo-600"
      ],
      "secondary": [
        "bg-indigo-300 text-indigo-500",
        "disabled:bg-gray-400 disabled:text-gray-600",
        "hover:bg-indigo-400 hover:text-white"
      ]
    }
  },
  "outlined": {
    className: "rounded-lg",
    colors: {
      "primary": [
        "bg-white border border-indigo-500 text-indigo-500 border-[2px]",
        "disabled:border-gray-500 disabled:text-gray-500",
        "hover:border-indigo-600 hover:text-indigo-600",
      ],
    }
  },
  "plain": {
    className: "p-0 h-auto",
    props: {
      disableRipple: true
    },
    colors: {
      "primary": [
        "text-indigo-500 bg-transparent underline underline-offset-4",
        "disabled:text-gray-600",
        "hover:text-indigo-600"
      ],
    }
  },
})

type ButtonProps =
  & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'disabled'>
  & {
    variant?: keyof typeof buttonVariants
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    disableRipple?: boolean
    customSize?: boolean
    color?: string
    isDisabled?: boolean
    as?: keyof JSX.IntrinsicElements
  }

export default function Button(props: ButtonProps) {

  const {
    onClick,
    variant,
    startContent,
    endContent,
    disableRipple,
    color,
    isDisabled,
    className,
    customSize,
    ...buttonProps
  } = props

  const {
    ripples,
    onClick: onRippleClick,
    onClear
  } = useRipple();

  const {
    className: variantClassName,
    props: variantProps,
  } = pickVariant(buttonVariants, props.variant || "filled", (props.color as any) || "primary")

  const computedDisableRipple = disableRipple || variantProps?.disableRipple

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }
    if (!computedDisableRipple) {
      onRippleClick(e)
    }
    onClick?.(e)
  }, [
    isDisabled,
    disableRipple,
    onRippleClick,
    onClick
  ])

  return <Tag
    as={props.as || 'button'}
    disabled={isDisabled}
    className={twMerge(
      [
        "py-3 px-4",
        "inline-flex items-center justify-center gap-unit-2",
        "whitespace-nowrap font-normal",
        !customSize && "min-w-unit-20 h-unit-10 [&>svg]:max-w-[theme(spacing.unit-8)]",
        "transition-all motion-reduce:transition-none enabled:active:scale-[0.97]",
        "z-0 relative box-border appearance-none select-none subpixel-antialiased overflow-hidden tap-highlight-transparent"
      ],
      variantClassName,
      className
    )}
    onClick={handleClick}
    {...buttonProps}
  >
    {props.startContent}
    {props.children}
    {props.endContent}

    {!computedDisableRipple && <Ripple
      ripples={ripples}
      onClear={onClear}
    />}
  </Tag>

}
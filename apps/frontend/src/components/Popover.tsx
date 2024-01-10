import {
  offset,
  useDismiss,
  useFloating,
  useClick,
  useFocus,
  useInteractions,
  OffsetOptions,
  Placement
} from "@floating-ui/react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import React, { createContext, useContext, useMemo } from "react"


type PopoverProps = {
  children: React.ReactNode
  isOpen: boolean
  offset?: OffsetOptions
  placement?: Placement
  onOpenChange: (isOpen: boolean) => void
  focusOptions?: Parameters<typeof useFocus>[1]
  interactions?: {
    click?: boolean
    focus?: boolean
    dismiss?: boolean
  }
}

type PopoverTriggerProps = {
  children: React.ReactElement
}

type PopoverContentProps = {
  children: React.ReactNode
}

type PopoverContext = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  floatingStyles: React.CSSProperties
  getFloatingProps: () => any
  getReferenceProps: () => any
  refs: {
    setFloating: (element: HTMLElement) => void
    setReference: (element: HTMLElement) => void
  }
}

const PopoverContext = createContext({} as PopoverContext)

const usePopover = () => useContext(PopoverContext)

export default function Popover(props: PopoverProps) {

  const {
    isOpen,
    onOpenChange,
  } = props

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    placement: props?.placement || 'bottom',
    middleware: [
      offset(props?.offset || 1),
    ]
  })

  const {
    focus: asFocus = true,
    dismiss: asDismiss = true,
    click: asClick = true
  } = props?.interactions || {}

  const focus = asFocus ? useFocus(context) : undefined
  const dismiss = asDismiss ? useDismiss(context) : undefined
  const click = asClick ? useClick(context) : undefined

  const { getFloatingProps, getReferenceProps } = useInteractions([
    focus,
    dismiss,
    click
  ].filter(Boolean))

  return <PopoverContext.Provider value={{
    isOpen,
    onOpenChange,
    refs,
    floatingStyles,
    getFloatingProps,
    getReferenceProps
  }}>
    {props.children}
  </PopoverContext.Provider>

}

export function PopoverTrigger(props: PopoverTriggerProps) {

  const { refs, getReferenceProps } = usePopover()

  return React.cloneElement(props.children, {
    ...props.children?.props || {},
    ref: refs.setReference,
    ...getReferenceProps(),
  })
}

export function PopoverContent(props: PopoverContentProps) {

  const { isOpen, refs, floatingStyles, getFloatingProps } = usePopover()

  return <AnimatePresence>
    {isOpen && <motion.ul
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      className={clsx('z-10 w-full overflow-hidden bg-white border border-t-0 rounded-t-none border-indigo-500 rounded-sm')}
      ref={refs.setFloating}
      style={floatingStyles}
      {...getFloatingProps()}
    >
      {props.children}
    </motion.ul>}
  </AnimatePresence>
}
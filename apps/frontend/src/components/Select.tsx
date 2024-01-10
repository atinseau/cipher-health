'use client';

import { offset, size, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import clsx from 'clsx';
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

import isEqual from 'lodash/isEqual'

import { AnimatePresence, motion } from 'framer-motion'
import BaseInput, { BaseInputProps } from './Inputs/BaseInput';

type SelectItem = {
  id?: string,
  label: string,
  value: any
}

type SelectProps = BaseInputProps & {
  placeholder?: string
  isRequired?: boolean
  onChange?: (value: string) => void
  items: Array<SelectItem>
}

export default function Select(props: SelectProps) {

  const {
    placeholder,
    onChange,
    items,
    ...baseInput
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(undefined)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(0),
      size({

      })
    ]
  })

  const focus = useClick(context)
  const dismiss = useDismiss(context)

  const { getFloatingProps, getReferenceProps } = useInteractions([
    focus,
    dismiss
  ])

  const handleChange = (item: SelectItem) => {
    setIsOpen(false)
    setSelectedItem(item)
    onChange?.(item.value)
  }

  return <BaseInput {...baseInput} required={props?.isRequired} classNames={{ base: 'relative' }}>
    <button
      ref={refs.setReference}
      className={clsx("hover:bg-indigo-300 whitespace-nowrap transition-[border-radius,background] w-full flex justify-between items-center gap-2 border leading-[20px] border-indigo-500 rounded-sm font-normal p-[11px] font-roboto", {
        'rounded-b-none': isOpen,
        'text-indigo-400': !selectedItem,
        'text-black': selectedItem
      })}
      {...getReferenceProps()}
    >
      {!selectedItem ? placeholder : (selectedItem?.label || placeholder)}
      <IoIosArrowDown className={clsx("transition-all text-indigo-500 pt-[2px]", {
        'rotate-180': isOpen
      })} size={20} />
    </button>
    <AnimatePresence>
      {isOpen && <motion.ul
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        exit={{ height: 0 }}
        className={clsx('z-10 w-full overflow-hidden bg-white border border-t-0 rounded-t-none border-indigo-500 rounded-sm')}
        ref={refs.setFloating}
        style={floatingStyles}
        {...getFloatingProps()}
      >
        {items.map((item, index) => <li
          onClick={() => handleChange(item)}
          className={clsx("cursor-pointer leading-base text-base hover:bg-indigo-300 p-2.5", {
            'bg-indigo-300': isEqual(selectedItem, item)
          })}
          key={item.id || index}
        >
          {item.label}
        </li>)}
      </motion.ul>}
    </AnimatePresence>
  </BaseInput>
}
'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

import isEqual from 'lodash/isEqual'

import BaseInput, { BaseInputProps } from './BaseInput';
import Popover, { PopoverContent, PopoverTrigger } from '../Popover';

type SelectItem = {
  id?: string,
  label: string,
  value: any
}

type SelectProps = {
  placeholder?: string
  isRequired?: boolean
  onChange?: (value: string) => void
  items: Array<SelectItem>
  baseInputProps?: BaseInputProps
}

export default function SelectInput(props: SelectProps) {

  const {
    placeholder,
    onChange,
    items,
    baseInputProps
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(undefined)

  const handleChange = (item: SelectItem) => {
    setIsOpen(false)
    setSelectedItem(item)
    onChange?.(item.value)
  }

  return <BaseInput {...baseInputProps} isRequired={props?.isRequired} classNames={{ base: 'relative' }}>
    <Popover
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      interactions={{
        focus: false
      }}
    >
      <PopoverTrigger>
        <button
          className={clsx("relative z-[11] hover:bg-indigo-300 whitespace-nowrap transition-[border-radius,background] w-full flex justify-between items-center gap-2 border leading-[20px] border-indigo-500 rounded-sm font-normal p-[11px] font-roboto", {
            'rounded-b-none': isOpen,
            'text-indigo-400': !selectedItem,
            'text-black': selectedItem
          })}
        >
          {!selectedItem ? placeholder : (selectedItem?.label || placeholder)}
          <IoIosArrowDown className={clsx("transition-all text-indigo-500 pt-[2px]", {
            'rotate-180': isOpen
          })} size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        {items.map((item, index) => <li
          onClick={() => handleChange(item)}
          className={clsx("cursor-pointer leading-[20px] text-base hover:bg-indigo-300 p-2.5", {
            'bg-indigo-300': isEqual(selectedItem, item)
          })}
          key={item.id || index}
        >
          {item.label}
        </li>)}
      </PopoverContent>
    </Popover>
  </BaseInput>
}
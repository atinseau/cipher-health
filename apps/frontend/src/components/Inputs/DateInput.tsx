'use client';

import { FocusEvent, useEffect, useState } from 'react';
import TextInput, { TextInputProps } from './TextInput';

import {
  flip,
  offset,
  shift,
  useFloating,
  useFocus,
  useInteractions,
  autoUpdate,
  useDismiss,
} from '@floating-ui/react';

import { CiCalendar } from "react-icons/ci";

import DatePicker, { Picker } from '../DatePicker/DatePicker';

export type DateInputProps = Omit<TextInputProps, 'onChange' | 'defaultValue'> & {
  autoClose?: boolean
  defaultValue?: Date
  onChange?: (date?: Date) => void
}

export default function DateInput(props: DateInputProps) {

  const {
    autoClose,
    onChange,
    defaultValue,
    ...textInputProps
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(defaultValue)
  const [activePicker, setActivePicker] = useState<Picker>('year')

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    onOpenChange: setIsOpen,
    middleware: [
      offset({
        mainAxis: 10,
        alignmentAxis: -10
      }),
      flip(),
      shift(),
    ]
  })

  const focus = useFocus(context)
  const dismiss = useDismiss(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([
    focus,
    dismiss
  ])


  const referenceProps = getReferenceProps() as {
    onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void
  }

  // Reset picker when input is unfocused
  useEffect(() => {
    if (!isOpen) {
      setActivePicker('year')
    }
  }, [isOpen])

  return (<>
    <TextInput
      {...textInputProps}
      {...referenceProps}
      ref={refs.setReference}
      baseInputProps={{
        ...textInputProps?.baseInputProps,
      }}
      readOnly
      value={date?.toLocaleDateString() || ''}
      endContent={<CiCalendar size={20} className="text-indigo-500" />}
      onMouseUp={(e) => {
        const input = e.target as HTMLInputElement
        const cursorPosition = input.selectionStart || 0
        if (input.value.length === 10) {
          if (cursorPosition < 3) {
            setActivePicker('day')
          } else if (cursorPosition < 6) {
            setActivePicker('month')
          } else {
            setActivePicker('year')
          }
        }
        referenceProps.onFocus?.(e as any)
      }}
      onFocus={undefined}
    />
    {isOpen && <DatePicker
      ref={refs.setFloating}
      style={floatingStyles}
      picker={activePicker}
      setPicker={setActivePicker}
      onSelect={(date) => {
        setDate(date)
        onChange?.(date)
        if (props.autoClose) {
          setIsOpen(false)
        }
      }}
      initialDate={date}
      {...getFloatingProps()}
    />}
  </>
  );
}

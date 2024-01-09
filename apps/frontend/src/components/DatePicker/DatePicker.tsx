'use client';

import { forwardRef, useEffect, useRef, useState } from "react";
import DayPicker from "./Day/DayPicker";
import MonthPicker from "./Month/MonthPicker";
import YearPicker from "./Year/YearPicker";

const Pickers = [
  YearPicker,
  MonthPicker,
  DayPicker
]

type DatePickerProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onSelect'> & {
  initialDate?: Date
  picker?: 'year' | 'month' | 'day'
  setPicker?: (picker: 'year' | 'month' | 'day') => void
  onSelect?: (date: Date) => void
}

export type Picker = 'year' | 'month' | 'day'

function getPickerId(name: Picker) {
  switch (name) {
    case 'year':
      return 0
    case 'month':
      return 1
    case 'day':
      return 2
  }
}

function getPickerName(id: number) {
  switch (id) {
    case 0:
      return 'year'
    case 1:
      return 'month'
    case 2:
      return 'day'
  }
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {

  const {
    onSelect,
    picker,
    setPicker,
    initialDate,
    ...divProps
  } = props

  const [date, setDate] = useState<Date | undefined>(initialDate)

  const [
    internalPickerIndex,
    setInternalPickerIndex
  ] = useState(getPickerId('year'))

  const pickerIndex = picker !== undefined
    ? getPickerId(picker)
    : internalPickerIndex

  const setPickerIndex = (index: number) => {
    if (setPicker) {
      setPicker(getPickerName(index) || 'year')
    } else {
      setInternalPickerIndex(index)
    }
  }

  const Picker = Pickers[pickerIndex]


  const handleSelect = (date: Date) => {
    setDate(date)
    if (pickerIndex + 1 > Pickers.length - 1) {
      onSelect?.(date)
      return
    }
    setPickerIndex(pickerIndex + 1)
  }

  return <Picker
    onSelect={handleSelect}
    initialDate={date}
    {...divProps}
    ref={ref}
    {...pickerIndex === 2
      ? {
        onMonthClick: () => setPickerIndex(1),
        onYearClick: () => setPickerIndex(0)
      }
      : {}
    }
  />

})

export default DatePicker
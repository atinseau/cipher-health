'use client';

import { useState } from 'react';

import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import clsx from 'clsx';
import dayjs from 'dayjs';


type DateItem = {
  index: number,
  date: Date,
  currentMonth?: boolean,
  prevMonth?: boolean,
  nextMonth?: boolean,
  today?: boolean
}

function DateCell({ isDisabled, isSelected, isToday, label, date, onClick }: {
  isDisabled?: boolean,
  label: number | string,
  date?: Date,
  isSelected?: boolean,
  isToday?: boolean,
  onClick?: (date?: Date) => void
}) {
  return <div onClick={() => onClick?.(date)} className={clsx('w-[35px] h-[24px] flex items-center justify-center cursor-pointer', {
    'hover:text-indigo-500': !isSelected,
  })}>
    <span
      className={clsx("p-1", {
        'text-gray-600': isDisabled,
        'bg-indigo-500 text-white rounded-sm w-[30px] text-center': isSelected,
        'bg-indigo-300 text-indigo-500 rounded-sm w-[30px] text-center': isToday,
      })}
    >
      {label}
    </span>
  </div>
}

type DayGridHeaderProps = {
  dateCursor: Date,
  setDateCursor: (date: Date) => void,
  changeMonth: (direction: 'prev' | 'next') => void
  onYearClick?: () => void
  onMonthClick?: () => void
}

function DayGridHeader({ dateCursor, setDateCursor, changeMonth, onMonthClick, onYearClick }: DayGridHeaderProps) {

  return <div className='flex justify-between mb-4'>
    <SlArrowLeft className="text-indigo-500 cursor-pointer" onClick={() => changeMonth('prev')} />
    <h4
      onClick={!onMonthClick && !onYearClick ? () => setDateCursor(new Date()) : undefined}
      className={clsx('text-base font-bold capitalize', {
        'hover:text-indigo-500 cursor-pointer': !onMonthClick && !onYearClick,
        'flex justify-center gap-8 w-full': onMonthClick || onYearClick,
      })}
    >
      <span
        className={clsx(onMonthClick && "hover:text-indigo-500 cursor-pointer")}
        onClick={onMonthClick}>
        {dateCursor.toLocaleString('default', { month: 'long' })}
      </span>
      {' '}
      <span
        className={clsx(onYearClick && "hover:text-indigo-500 cursor-pointer")}
        onClick={onYearClick}>
        {dateCursor.toLocaleString('default', { year: 'numeric' })}
      </span>
    </h4>
    <SlArrowRight className="text-indigo-500 cursor-pointer" onClick={() => changeMonth('next')} />
  </div>
}

type DayGridProps = {
  initialDate?: Date,
  onChange?: (date: Date) => void
  onYearClick?: () => void
  onMonthClick?: () => void
}

export default function DayGrid({ initialDate, onChange, onMonthClick, onYearClick }: DayGridProps) {

  const [dateCursor, setDateCursor] = useState(initialDate || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)

  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  const currentMonthGrid = (): DateItem[] => {

    const monthDate = dayjs(dateCursor).startOf('month')
    let firstDayOfMonth = monthDate.day()

    firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth

    const firstWeekLength = (7 - firstDayOfMonth) + 1 // to fix sunday start of week
    const prevMonthWeekLength = 7 - firstWeekLength

    let lastDayOfLastMonth = dayjs(monthDate).subtract(1, 'month').endOf('month').date()

    const firstWeek = [
      ...Array.from({ length: prevMonthWeekLength }).map(() => ({
        date: new Date(monthDate.year(), monthDate.month() - 1, lastDayOfLastMonth),
        index: lastDayOfLastMonth--,
        prevMonth: true,
      })).reverse(),
      ...Array.from({ length: firstWeekLength }).map((_, index) => ({
        index: index + 1,
        currentMonth: true,
        date: new Date(monthDate.year(), monthDate.month(), index + 1)
      }))
    ]

    const nextWeek = Array.from({ length: 5 * 7 }).map((_, index) => {
      const dayMonthIndex = firstWeek[firstWeek.length - 1].index + index + 1
      if (dayMonthIndex > monthDate.daysInMonth()) {
        return {
          nextMonth: true,
          index: dayMonthIndex - monthDate.daysInMonth(),
          date: new Date(monthDate.year(), monthDate.month() + 1, dayMonthIndex - monthDate.daysInMonth())
        }
      }
      return {
        index: dayMonthIndex,
        currentMonth: true,
        date: new Date(monthDate.year(), monthDate.month(), dayMonthIndex)
      }
    })

    const grid = [...firstWeek, ...nextWeek]

    return grid.map((day) => {
      if (dayjs(day.date).isSame(dayjs(new Date()), 'day'))
        return { ...day, today: true }
      return day
    })
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev')
      setDateCursor(dayjs(dateCursor).subtract(1, 'month').toDate())
    else
      setDateCursor(dayjs(dateCursor).add(1, 'month').toDate())
  }

  const handleDateChange = (date?: Date) => {
    const nextDate = dayjs(date).toDate()
    setSelectedDate(nextDate)
    onChange?.(nextDate)
  }

  return <div className='select-none'>

    <DayGridHeader
      dateCursor={dateCursor}
      setDateCursor={setDateCursor}
      changeMonth={changeMonth}
      onMonthClick={onMonthClick}
      onYearClick={onYearClick}
    />

    <div className='grid grid-cols-7 mt-2 gap-y-3 items-center justify-center'>
      {days.map((day, index) => <DateCell label={day} key={day + '_' + index} isDisabled />)}
      {currentMonthGrid().map((day, index) => <DateCell
        key={day.date + '_' + index}
        isDisabled={day.prevMonth || day.nextMonth}
        isSelected={dayjs(day.date).isSame(dayjs(selectedDate), 'day')}
        isToday={day.today}
        date={day.date}
        label={day.index}
        onClick={handleDateChange}
      />)}
    </div>
  </div>
}
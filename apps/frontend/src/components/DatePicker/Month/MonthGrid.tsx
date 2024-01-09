
import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

type MonthGridHeaderProps = {
  dateCursor: Date
  changeYear: (direction: 'prev' | 'next') => void
  setDateCursor: (date: Date) => void
}

function MonthGridHeader({ dateCursor, setDateCursor, changeYear }: MonthGridHeaderProps) {

  return <div className='flex justify-between mb-4'>
    <SlArrowLeft className="text-indigo-500 cursor-pointer" onClick={() => changeYear('prev')} />
    <h4
      onClick={() => setDateCursor(new Date())}
      className={'text-base font-bold capitalize cursor-pointer hover:text-indigo-500'}>
      {dateCursor.toLocaleString('default', { year: 'numeric' })}
    </h4>
    <SlArrowRight className="text-indigo-500 cursor-pointer" onClick={() => changeYear('next')} />
  </div>
}

function MonthCell({ label, isSelected, currentMonth, onClick, date }: {
  label: string,
  isSelected?: boolean,
  currentMonth?: boolean,
  date: Date,
  onClick?: (date: Date) => void
}) {
  return <div
    onClick={() => onClick?.(date)}
    className={classNames("w-[50px] h-[30px] flex items-center justify-center", {
      "bg-indigo-500 text-white rounded-sm": isSelected,
      "hover:text-indigo-500 cursor-pointer": !isSelected,
      "bg-indigo-300 text-indigo-500 rounded-sm": currentMonth
    })}
  >
    {label}
  </div>
}

type MonthGridProps = {
  initialDate?: Date
  onChange?: (date: Date) => void
}

export default function MonthGrid({ onChange, initialDate }: MonthGridProps) {

  const [dateCursor, setDateCursor] = useState(initialDate || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)

  const currentYearGrid = () => {
    const year = dateCursor.getFullYear()
    const months = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date(year, i, 1)
      return {
        label: date.toLocaleString('default', { month: 'short' }),
        date: date
      }
    })
    return months
  }

  const changeYear = (direction: 'prev' | 'next') => {
    const year = dateCursor.getFullYear()
    const newDate = new Date(year + (direction === 'prev' ? -1 : 1), 0, 1)
    setDateCursor(newDate)
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    onChange?.(date)
  }

  return <div className='select-none'>
    <MonthGridHeader
      dateCursor={dateCursor}
      setDateCursor={setDateCursor}
      changeYear={changeYear}
    />

    <div className="grid grid-cols-4 mt-2 gap-y-3 items-center justify-center">
      {currentYearGrid().map((month, i) => <MonthCell
        label={month.label}
        key={i}
        isSelected={dayjs(month.date).isSame(dayjs(selectedDate), 'month')}
        currentMonth={dayjs(month.date).isSame(new Date(), 'month')}
        date={month.date}
        onClick={handleDateChange}
      />)}
    </div>
  </div>
}
import classNames from "classnames";
import dayjs from "dayjs";
import { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

type YearGridHeaderProps = {
  startYear: number
  endYear: number
  changeYearRange: (direction: 'prev' | 'next') => void
  setDateCursor: (date: Date) => void
}

function YearGridHeader({ endYear, startYear, changeYearRange, setDateCursor }: YearGridHeaderProps) {

  return <div className='flex justify-between mb-4'>
    <SlArrowLeft className="text-indigo-500 cursor-pointer" onClick={() => changeYearRange('prev')} />
    <h4
      className={'text-base font-bold capitalize cursor-pointer hover:text-indigo-500'}
      onClick={() => setDateCursor(new Date())}
    >
      <span>{startYear}</span>
      <span className='mx-2'>-</span>
      <span>{endYear}</span>
    </h4>
    <SlArrowRight className="text-indigo-500 cursor-pointer" onClick={() => changeYearRange('next')} />
  </div>
}

function YearCell({ label, isSelected, currentYear, date, onClick }: {
  label: string,
  isSelected?: boolean,
  currentYear?: boolean,
  onClick?: (date: Date) => void, date: Date
}) {
  return <div onClick={() => onClick?.(date)} className={classNames("w-[50px] h-[30px] flex items-center justify-center", {
    "bg-indigo-500 text-white rounded-sm": isSelected,
    "hover:text-indigo-500 cursor-pointer": !isSelected,
    "bg-indigo-300 text-indigo-500 rounded-sm": currentYear
  })}>
    {label}
  </div>
}

type YearGridProps = {
  initialDate?: Date
  onChange?: (date: Date) => void
}

export default function YearGrid({ onChange, initialDate }: YearGridProps) {

  const [dateCursor, setDateCursor] = useState(initialDate || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)

  const yearRange = [
    dateCursor.getFullYear() - 5,
    dateCursor.getFullYear() + 6
  ]

  const currentGrid = () => {
    const startYear = yearRange[0]
    const endYear = yearRange[1]

    const years = Array.from({ length: (endYear - startYear) + 1 }).map((_, i) => {
      const date = new Date(startYear + i, 0, 1)
      return {
        label: date.toLocaleString('default', { year: "numeric" }),
        date: date
      }
    })
    return years
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    onChange?.(date)
  }

  const changeYearRange = (direction: 'prev' | 'next') => {
    const year = dateCursor.getFullYear()
    const newDate = new Date(year + (direction === 'prev' ? -12 : 12), 0, 1)
    setDateCursor(newDate)
  }

  return <div className='select-none'>
    <YearGridHeader
      startYear={yearRange[0]}
      endYear={yearRange[1]}
      setDateCursor={setDateCursor}
      changeYearRange={changeYearRange}
    />

    <div className="grid grid-cols-4 mt-2 gap-y-3 items-center justify-center">
      {currentGrid().map((year, i) => <YearCell
        key={i}
        label={year.label}
        date={year.date}
        isSelected={dayjs(year.date).isSame(selectedDate, 'year')}
        currentYear={dayjs(year.date).isSame(new Date(), 'year')}
        onClick={handleDateChange}
      />)}
    </div>

  </div>
}
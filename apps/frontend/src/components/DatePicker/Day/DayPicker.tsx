import { forwardRef } from "react";
import DayGrid from "./DayGrid";

type DayPickerProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onSelect'> & {
  onSelect?: (date: Date) => void
  onYearClick?: () => void
  onMonthClick?: () => void
  initialDate?: Date
}

const DayPicker = forwardRef<HTMLDivElement, DayPickerProps>((props, ref) => {

  const {
    onSelect,
    onYearClick,
    onMonthClick,
    initialDate,
    ...divProps
  } = props

  return <div className='z-10 bg-white rounded-md shadow-lg p-4' ref={ref} {...divProps}>
    <DayGrid
      onChange={onSelect}
      onYearClick={onYearClick}
      onMonthClick={onMonthClick}
      initialDate={initialDate}
    />
  </div>
})

export default DayPicker
import { forwardRef } from "react";
import MonthGrid from "./MonthGrid";

type MonthPickerProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onSelect'> & {
  onSelect?: (date: Date) => void
  initialDate?: Date
}

const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>((props, ref) => {

  const {
    onSelect,
    initialDate,
    ...divProps
  } = props

  return <div className='z-10 bg-white rounded-md shadow-lg p-4' ref={ref} {...divProps}>
    <MonthGrid
      onChange={onSelect}
      initialDate={initialDate}
    />
  </div>
})

export default MonthPicker
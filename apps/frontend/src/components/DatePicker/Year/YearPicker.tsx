import { forwardRef } from "react";
import YearGrid from "./YearGrid";

type YearPickerProps = Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onSelect'> & {
  onSelect?: (date: Date) => void
  initialDate?: Date
}

const YearPicker = forwardRef<HTMLDivElement, YearPickerProps>((props, ref) => {

  const {
    onSelect,
    initialDate,
    ...divProps
  } = props

  return <div className='z-10 bg-white rounded-md shadow-lg p-4' ref={ref} {...divProps}>
    <YearGrid
      onChange={onSelect}
      initialDate={initialDate}
    />
  </div>
})

export default YearPicker
import { useState } from 'react';
import DatePicker from 'react-datepicker'

type DateInputProps = {

}

export default function DateInput() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  );
}

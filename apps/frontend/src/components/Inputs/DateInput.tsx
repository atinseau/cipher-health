// 'use client';

// import { FocusEvent, useRef, useState } from 'react';
// import TextInput, { TextInputProps } from './TextInput';

// import {
//   flip,
//   offset,
//   shift,
//   useFloating,
//   useFocus,
//   useInteractions,
//   autoUpdate,
//   useDismiss,
// } from '@floating-ui/react';

// import { CiCalendar } from "react-icons/ci";

// import DatePicker, { Picker } from '../DatePicker/DatePicker';

// type DateInputProps = TextInputProps & {
//   autoClose?: boolean
// }

export default function DateInput(props: any) {
  return <div></div>
}

// export default function DateInput(props: DateInputProps) {

//   const [isOpen, setIsOpen] = useState(false)

//   const [date, setDate] = useState<Date | undefined>(undefined)

//   const { refs, floatingStyles, context } = useFloating({
//     open: isOpen,
//     placement: 'bottom-start',
//     whileElementsMounted: autoUpdate,
//     onOpenChange: setIsOpen,
//     middleware: [
//       offset(10),
//       flip(),
//       shift(),
//     ]
//   })

//   const focus = useFocus(context)
//   const dismiss = useDismiss(context);


//   const { getFloatingProps, getReferenceProps } = useInteractions([
//     focus,
//     dismiss
//   ])

//   const [activePicker, setActivePicker] = useState<Picker>('year')

//   const textInputProps = getReferenceProps() as {
//     onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void
//   }

//   return (<>
//     <TextInput
//       {...props}
//       value={date?.toLocaleDateString() || ''}
//       containerRef={refs.setReference}
//       endContent={<CiCalendar size={20} className="text-indigo-500" />}
//       {...textInputProps}
//       onMouseUp={(e) => {
//         const input = e.target as HTMLInputElement
//         const cursorPosition = input.selectionStart || 0
//         if (input.value.length === 10) {
//           if (cursorPosition < 3) {
//             setActivePicker('day')
//           } else if (cursorPosition < 6) {
//             setActivePicker('month')
//           } else {
//             setActivePicker('year')
//           }
//         }
//         textInputProps.onFocus?.(e as any)
//       }}
//       onFocus={undefined}
//     />
//     {isOpen && <DatePicker
//       ref={refs.setFloating}
//       style={floatingStyles}
//       picker={activePicker}
//       setPicker={setActivePicker}
//       onSelect={(date) => {
//         setDate(date)
//         if (props.autoClose) {
//           setIsOpen(false)
//         }
//       }}
//       initialDate={date}
//       {...getFloatingProps()}
//     />}
//   </>
//   );
// }


import { Spinner as SpinnerNextUI } from '@nextui-org/spinner'
import { type MotionProps, motion } from 'framer-motion'


export default function Spinner() {
  return <div className="h-full flex flex-col justify-center items-center">
    <SpinnerNextUI
      color='warning'
      classNames={{
        wrapper: 'w-16 h-16',
        circle1: 'border-b-indigo-500',
        circle2: 'border-b-indigo-500',
      }}
    />
  </div>

} 
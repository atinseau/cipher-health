import { motion } from 'framer-motion'

type SmoothExitProps = {
  children: React.ReactNode
}

export default function SmoothExit(props: SmoothExitProps) {

  return <motion.div
    className='h-full w-full'
    exit={{ opacity: 0 }}
  >
    {props.children}
  </motion.div>

}
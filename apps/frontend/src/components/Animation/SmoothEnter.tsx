import { motion } from 'framer-motion'

type SmoothEnterProps = {
  children: React.ReactNode
}

export default function SmoothEnter(props: SmoothEnterProps) {

  return <motion.div
    className='h-full w-full'
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {props.children}
  </motion.div>

}
'use client';

import Notif, { NotifProps, NotifType } from "@/components/Notif";
import { createContext, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

import { AnimatePresence, motion } from 'framer-motion'

const DURATION = 5000

type NotificationProviderProps = {
  children: React.ReactNode
}

type INotificationContext = {
  notify: (options: {
    type?: NotifType,
    title: string,
    message?: string,
    icon?: React.ReactNode,
    onClose?: () => void,
    duration?: number
  } | string) => void
}

export const NotificationContext = createContext({} as INotificationContext)

const NotificationPortal = forwardRef<HTMLDivElement>((_, ref) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
      return
    }
  }, [])

  return isMounted
    ? createPortal(<div
      className="fixed top-[72px] right-0 z-50"
      ref={ref}
    />, document.body)
    : null
})

function Notification(props: NotifProps & { unmount: () => void, duration?: number }) {

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, props?.duration || DURATION)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return <AnimatePresence
    onExitComplete={() => {
      props.unmount()
    }}
  >
    {isVisible && <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.2 }}
    >
      <Notif
        {...props}
        onClose={() => {
          props?.onClose?.()
          setIsVisible(false)
        }}
      />
    </motion.div>}
  </AnimatePresence>
}

export default function NotificationProvider(props: NotificationProviderProps) {

  const portalRef = useRef<HTMLDivElement>(null)

  const notify = useCallback((options: Parameters<INotificationContext['notify']>[0]) => {
    const portal = portalRef.current
    if (!portal) return

    const type = typeof options === 'string' ? 'success' : options.type
    const notif = document.createElement('div') // Will mount the notif component in this div
    portal.appendChild(notif)

    const componentRoot = createRoot(notif)

    const unmount = async () => {
      componentRoot.unmount()
      portal.removeChild(notif)
    }

    componentRoot.render(<Notification
      type={type || 'success'}
      title={typeof options === 'string' ? options : options.title}
      message={typeof options === 'string' ? undefined : options.message}
      icon={typeof options === 'string' ? undefined : options.icon}
      onClose={typeof options === 'string' ? undefined : options.onClose}
      unmount={unmount}
    />)
  }, [])

  return <NotificationContext.Provider value={{ notify }}>
    {props.children}
    <NotificationPortal ref={portalRef} />
  </NotificationContext.Provider>
}
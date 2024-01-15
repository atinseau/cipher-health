import { useContext } from "react";
import { NotificationContext } from "../NotificationProvider";



export default function useNotify() {
  const notifContext = useContext(NotificationContext)

  if (!notifContext) {
    throw new Error('useNotify must be used within a NotificationProvider')
  }

  return notifContext.notify
}
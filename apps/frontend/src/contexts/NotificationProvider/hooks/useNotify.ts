import { useContext } from "react";
import { NotificationContext } from "../NotificationProvider";



export default function useNotify() {
  const notifContext = useContext(NotificationContext)
  return notifContext.notify
}
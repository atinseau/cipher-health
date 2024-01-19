import { useAtom } from "jotai";
import { isConnectedAtom, userAtom } from "../authStore";


export default function useUser() {
  const [user] = useAtom(userAtom)
  const [isConnected] = useAtom(isConnectedAtom)

  return {
    user,
    isConnected,
    loading: isConnected === undefined,
  }
}
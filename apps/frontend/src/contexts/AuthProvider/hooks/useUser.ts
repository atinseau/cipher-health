import { useAtom } from "jotai";
import { userAtom } from "../authStore";


export default function useUser() {
  return useAtom(userAtom)
}
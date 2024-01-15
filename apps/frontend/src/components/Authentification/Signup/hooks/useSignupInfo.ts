import { useAtom } from "jotai";
import { signupInfoAtom } from "../signupStore";

export default function useSignupInfo() {
  return useAtom(signupInfoAtom)
}
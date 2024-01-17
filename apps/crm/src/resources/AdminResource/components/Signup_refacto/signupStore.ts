import { SignupInfo } from "@cipher-health/sdk";
import { atom, createStore } from "jotai";

const signupStore = createStore()

const signupInfoAtom = atom<SignupInfo | null>(null)
const stwtAtom = atom<string | undefined>(undefined)

export {
  signupStore,
  signupInfoAtom,
  stwtAtom
}
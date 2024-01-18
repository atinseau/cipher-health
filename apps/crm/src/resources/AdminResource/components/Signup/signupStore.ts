import { SignupInfo } from "@cipher-health/sdk";
import { atom, createStore } from "jotai";

const signupStore = createStore()

const signupInfoAtom = atom<SignupInfo | null>(null)

export {
  signupStore,
  signupInfoAtom
}
import type { UserModel } from '@cipher-health/sdk'
import { atom, createStore } from 'jotai'

const authStore = createStore()

const userAtom = atom<UserModel | null>(null)

export {
  userAtom,
  authStore,
}
import type { UserModel } from '@cipher-health/sdk'
import { atom, createStore } from 'jotai'

const authStore = createStore()

const userAtom = atom<UserModel | null>(null)

// undefined means we don't know if we're connected or not
// (like a loading state)
const isConnectedAtom = atom<undefined | boolean>(undefined)

export {
  userAtom,
  authStore,
  isConnectedAtom,
}
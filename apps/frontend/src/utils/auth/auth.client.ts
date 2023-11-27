'use client'

import {
  signOut as nextAuthSignOut,
  signIn as nextAuthSignIn
} from "next-auth/react"

const signOut = () => nextAuthSignOut()
const signIn = () => nextAuthSignIn()

export {
  signOut,
  signIn
}
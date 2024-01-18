import { UserType } from "@prisma/client"

export type IStwt = {
  type: UserType,
  data?: any
}

export type SignupInfo =
  | { status: 'USER_NOT_VERIFIED', codeSent: boolean }
  | { status: 'USER_NOT_CREATED' }
  | { status: 'USER_NOT_COMPLETED' }
  | { status: 'USER_ALREADY_CREATED' }
import { UserType } from "@prisma/client"

export type IStwt = {
  type: UserType,
  data?: any
}
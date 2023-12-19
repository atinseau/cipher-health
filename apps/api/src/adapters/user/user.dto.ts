import { Prisma, User } from "@prisma/client";

export type UserModel = Prisma.UserGetPayload<{
  select: {
    [K in keyof Required<Prisma.UserSelect>]: true
  }
}>

export type UserCreate = Omit<User,
  | 'id'
  | 'deletedAt'
  | 'type'
  | 'createdAt'
  | 'updatedAt'
  | 'verified'
  | 'verificationToken'
  | 'lastVerificationRequest'
  | 'status'
>

export type UserToken = {
  id: string
  iat: number
  exp: number
}
import { User } from "@prisma/client";

export type UserCreate = Omit<User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
>

export type UserToken = {
  id: string
  email: string
  iat: number
  exp: number
}
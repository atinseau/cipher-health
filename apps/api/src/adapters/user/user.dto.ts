import { User } from "@prisma/client";

export type UserCreate = Omit<User,
  | 'id'
  | 'phone'
  | 'deletedAt'
  | 'type'
  | 'createdAt'
  | 'updatedAt'
  | 'verified'
>

export type UserToken = {
  id: string
  email: string
  iat: number
  exp: number
}
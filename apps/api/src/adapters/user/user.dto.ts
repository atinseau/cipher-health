import { User } from "@prisma/client";

export type UserCreate = Omit<User,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
>
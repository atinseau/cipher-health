import { Prisma, Profile, User, UserType } from "@prisma/client";

export type UserModel = Prisma.UserGetPayload<{
  select: {
    [K in keyof Required<Prisma.UserSelect>]: true
  }
}>

/**
 * The password type checking should be done in the function that calls this one
 * that why we force the password to be defined here
 */
export type UserCreate = Omit<User,
  | 'id'
  | 'deletedAt'
  | 'type'
  | 'createdAt'
  | 'updatedAt'
  | 'completed'
  | 'verified'
  | 'verificationToken'
  | 'lastVerificationRequest'
  | 'status'
> & {
  password: string,
  type?: UserType,
  verified?: boolean,
  completed?: boolean,
}

export type ProfileCreate = Omit<Profile,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'userId'
> & {
  birthDate?: Date,
  birthName?: string,
  addressDetails?: string
}

export type UserToken = {
  id: string
  iat: number
  exp: number
}
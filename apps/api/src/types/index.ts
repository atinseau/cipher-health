import { UserModel } from "../adapters/user/user.dto"
import { JwtPayload } from "jsonwebtoken"

declare global {

  type AsyncReturnType<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>

  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      ACCESS_TOKEN_EXPIRY: string
      REFRESH_TOKEN_EXPIRY: string
      STWT_SECRET: string // Signup Token With Type (stwt)
      STWT_EXPIRY: string
      ADMIN_PANEL_URL: string
      REDIS_HOST: string
      REDIS_PORT: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      NODE_ENV: 'development' | 'production'
      MAIL_USER: string
      MAIL_PASSWORD: string
      ADMIN_PASSWORD: string
      ADMIN_EMAIL: string
    }
  }

  namespace Express {
    export interface Request {
      userJwt?: JwtPayload
      user?: UserModel
      accessToken: string
    }
  }
}


export type * from '../adapters/user/user.dto'
export type * from '@prisma/client'
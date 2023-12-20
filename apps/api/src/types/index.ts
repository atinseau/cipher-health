import { UserModel } from "@/adapters/user/user.dto"
import { JwtPayload } from "jsonwebtoken"

declare global {

  type AsyncReturnType<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>

  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      REDIS_HOST: string
      REDIS_PORT: string
      NODE_ENV: 'development' | 'production'
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

export {}
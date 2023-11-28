import type { PrismaClient } from "@prisma/client"
import type { FastifyInstance } from "fastify"

// GLOBAL TYPES

declare global {
  type UserInsertion = {
    email: string
    password: string
    firstName: string
    lastName: string
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    user: {
      create: (user: UserInsertion) => Promise<[
        null | string,
        null | string
      ]>
    }
    crypt: {
      hash: (str: string) => Promise<string>
    }
    env: {
      PORT: string
    }
  }
}
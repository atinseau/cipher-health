import type { PrismaClient } from "@prisma/client"
import type { FastifyInstance } from "fastify"

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    env: {
      PORT: string
    }
  }
}
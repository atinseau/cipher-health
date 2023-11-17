import fastifyPlugin from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const dbPlugin = fastifyPlugin((fastify, _, done) => {
  prisma.$connect().then(() => {
    console.log('Connected to DB')
    fastify.decorate('prisma', prisma)
    done()
  })
})

export default dbPlugin
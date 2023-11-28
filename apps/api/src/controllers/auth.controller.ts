import { FastifyReply, FastifyRequest } from "fastify"
import { signupSchema } from "@/global/schemas/auth.schema"
import { omit } from "lodash"

import { fastifyInstance as fastify } from "@/server/app"

export default class AuthController {

  static prefix = '/auth'

  static async signup(req: FastifyRequest, reply: FastifyReply) {
    
    console.log(fastify.user)
    
    const body = await signupSchema.safeParseAsync(req.body)
    if (body.success !== true) {
      reply
        .status(422)
        .send({
          errors: body.error.errors
        })
      return
    }

    // remove confirmPassword from data to prevent 
    // prisma from trying to insert it into the db
    const [data, error] = await fastify.user.create(omit(body.data, ['confirmPassword']))
    if (error) {
      reply.status(500)
      return {
        success: false,
        errors: error
      }
    }

    reply.status(201)
    return {
      success: true,
      data: data
    }
  }

  static signin(req: FastifyRequest, reply: FastifyReply) {
    console.log(req.body)

    return {
      success: true,
      data: {}
    }
  }

}
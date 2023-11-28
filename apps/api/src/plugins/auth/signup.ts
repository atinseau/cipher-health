import { FastifyPluginCallback } from "fastify"
import { signupSchema } from "@/global/schemas/auth.schema"
import { omit } from "lodash"

const signupPlugin: FastifyPluginCallback = async (fastify, _) => {

  fastify.post("/signup", async (req, res) => {
    const body = await signupSchema.safeParseAsync(req.body)
    if (body.success !== true) {
      res
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
      res.status(500)
      return {
        success: false,
        errors: error
      }
    }

    res.status(201)
    return {
      success: true,
      data: data
    }
  })
}

export default signupPlugin
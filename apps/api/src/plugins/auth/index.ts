import { FastifyPluginCallback } from "fastify"
import signupPlugin from "./signup"
import signinPlugin from "./signin"

const authPlugin: FastifyPluginCallback = async (fastify, _) => {
  fastify.register(signupPlugin)
  fastify.register(signinPlugin)
}

export default authPlugin
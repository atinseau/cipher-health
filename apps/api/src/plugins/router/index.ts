import { FastifyPluginCallback } from "fastify"
import authPlugin from "@/plugins/auth"

const routerPlugin: FastifyPluginCallback = async (fastify, _) => {
  fastify.register(authPlugin, { prefix: '/auth' })
}

export default routerPlugin
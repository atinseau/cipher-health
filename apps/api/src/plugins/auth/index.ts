import { FastifyPluginCallback } from "fastify"

const authPlugin: FastifyPluginCallback = async (fastify, _) => {

  fastify.get('/', () => {
    return {
      message: 'Hello World from Fastify!'
    }
  })
 
}

export default authPlugin
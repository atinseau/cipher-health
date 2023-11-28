import { FastifyPluginCallback } from "fastify";

const signinPlugin: FastifyPluginCallback = async (fastify, _) => {

  fastify.post('/signin', async (req, res) => {
   console.log(req.body)
  })

}

export default signinPlugin
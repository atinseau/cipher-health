import { FastifyPluginCallback } from "fastify"



const userPlugin: FastifyPluginCallback = async (fastify, _) => {

  fastify.get('/', async () => {
    return {
      name: 'John Doe'
    }
  })

  fastify.get('/:id', async (req, res) => {

    const { id } = req.params as { id: string }

    console.log(await fastify.prisma.user.findMany())

    return {
      id: id,
      name: 'John Doe'
    }
  })
}

export default userPlugin
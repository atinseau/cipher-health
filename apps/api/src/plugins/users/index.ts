import { FastifyPluginCallback } from "fastify"



const userPlugin: FastifyPluginCallback = (fastify, opts, done) => {



  fastify.get('/', async () => {
    return {
      name: 'John Doe'
    }
  })

  fastify.get('/:id', async (req, res) => {

    const { id } = req.params as { id: string }

    req.sayHello(req.params)

    return {
      id: id,
      name: 'John Doe'
    }
  })

  done();
}

export default userPlugin
import fastifyPlugin from "fastify-plugin";
import bcrypt from "bcryptjs";


const cryptPlugin = fastifyPlugin((fastify, _, done) => {

  const hash = async (str: string) => {
    return await bcrypt.hash(str, 10)
  }

  fastify.decorate('crypt', {
    hash
  })

  done()
})

export default cryptPlugin
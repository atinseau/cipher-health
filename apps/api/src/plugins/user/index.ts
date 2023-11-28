import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import fastifyPlugin from "fastify-plugin"


const userPlugin = fastifyPlugin((fastify, _, done) => {

  const createUser = async (user: UserInsertion): Promise<[
    null | string,
    null | string
  ]> => {
    try {
      const result = await fastify.prisma.user.create({
        data: {
          ...user,
          password: await fastify.crypt.hash(user.password)
        }
      })
      return [result.id, null]
    } catch (e) {
      fastify.log.error(e)
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return [null, 'Email already exists']
      }
      return [null, 'Something went wrong']
    }

  }

  fastify.decorate('user', {
    create: createUser
  })

  done()
})


export default userPlugin
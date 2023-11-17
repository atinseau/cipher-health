import { createFastify } from './init'

async function main() {

  const fastify = await createFastify()

  try {
    await fastify.listen({
      port: parseInt(fastify.env.PORT)
    })
  } catch (e) {
    fastify.log.error("ERROR: ", e)
    process.exit(1)
  }
}

main()
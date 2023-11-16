import { createFastify } from './init'

async function main() {

  const fastify = createFastify()

  try {
    await fastify.listen({
      port: 3000
    })
  } catch (e) {
    fastify.log.error("ERROR: ", e)
    process.exit(1)
  }
}

main()
import Fastify from 'fastify'

let i = 0;

console.log('salut !')

const app = Fastify({
  logger: true,
})

app.get('/', async (request, reply) => {
  i++
  return {
    message: 'Hello World'
  }
})

async function main() {

  try {
    await app.listen({
      port: 3000
    })

  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }

}

main()
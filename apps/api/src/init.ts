import Fastify, { FastifyPluginCallback } from 'fastify'
import { API_PREFIX, ENV_SCHEMA } from './utils/constants'
import fastifyEnv from '@fastify/env'
import authPlugin from './plugins/auth'
import dbPlugin from './plugins/db'

const routePlugin: FastifyPluginCallback = async (fastify, _) => {
  fastify.register(authPlugin, { prefix: 'auth' })
}

const createFastify = async (opts = {}) => {
  const fastify = Fastify(opts)

  await fastify.register(dbPlugin)
  await fastify.register(fastifyEnv, {
    schema: ENV_SCHEMA,
    confKey: 'env',
    dotenv: true
  })

  // Register the app plugins
  fastify.register(routePlugin, { prefix: API_PREFIX })

  fastify.get('/', async (req, res) => {
    return {
      message: 'Hello World from Fastify!'
    }
  })

  return fastify
}

export {
  createFastify
}
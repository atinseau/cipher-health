import Fastify, { FastifyPluginCallback } from 'fastify'
import { API_PREFIX } from './utils/constants'
import userPlugin from './plugins/users'

const userDecorator: FastifyPluginCallback = async (fastify, opts) => {
  fastify.decorateRequest('sayHello', ({ id }) => {
    console.log('Hello from request decorator: ' + id)
  })
}

const routePlugin: FastifyPluginCallback = (fastify, _, done) => {

  fastify.register(userDecorator, { name: 'sayHello' })
  
  fastify.register(userPlugin, {
    prefix: '/users'
  })

  fastify.get('/', async (req, res) => {
    req.sayHello({ id: 'OK' })
    return 'OK'
  })

  done()
}

const createFastify = (opts = {}) => {
  const fastify = Fastify(opts)

  fastify.register(routePlugin, {
    prefix: API_PREFIX
  })

  return fastify
}

export {
  createFastify
}
import AuthController from "@/controllers/auth.controller";
import fastifyPlugin from "fastify-plugin";
import { API_PREFIX } from "@/global/config/constants";

const routerPlugin = fastifyPlugin((fastify, _, done) => {

  fastify.register(async (f) => {
    f.post('/signup', AuthController.signup)
    f.post('/signin', AuthController.signin)
  }, {
    prefix: API_PREFIX + AuthController.prefix
  })

  fastify.get('/', async () => {
    return {
      message: 'Welcome to the API'
    }
  })

  done()
})


export default routerPlugin
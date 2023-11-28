import fastify, { FastifyInstance } from "fastify";

import fastifyEnv from "@fastify/env";
import { ENV_SCHEMA } from "../global/config/constants";

import cryptPlugin from "@/plugins/crypt";
import dbPlugin from "@/plugins/db";
import userPlugin from "@/plugins/user";
import routerPlugin from "@/router";

export let fastifyInstance: FastifyInstance

export default class App {

  constructor() {
    fastifyInstance = fastify({
      ...this.createLogger()
    })
  }

  public async init() {
    await fastifyInstance.register(fastifyEnv, {
      schema: ENV_SCHEMA,
      confKey: 'env',
      dotenv: true
    })

    await fastifyInstance.register(cryptPlugin)
    await fastifyInstance.register(dbPlugin)
    await fastifyInstance.register(userPlugin)
    await fastifyInstance.register(routerPlugin)
  }

  private createLogger() {
    const logger: Record<
      NodeJS.ProcessEnv['NODE_ENV'],
      NonNullable<Parameters<typeof fastify>[0]>['logger']
    > = {
      'development': {
        transport: {
          target: 'pino-pretty'
        }
      },
      'production': true
    }
    return {
      disableRequestLogging: true,
      logger: logger[process.env.NODE_ENV || 'development']
    }
  }

  public async run() {
    try {
      await fastifyInstance.listen({
        port: parseInt(fastifyInstance.env.PORT)
      })
    } catch (e) {
      fastifyInstance.log.error("ERROR: ", e)
      process.exit(1)
    }
  }

}
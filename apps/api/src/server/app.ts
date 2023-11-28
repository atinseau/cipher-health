import fastify, { FastifyInstance } from "fastify";

import fastifyEnv from "@fastify/env";
import { API_PREFIX, ENV_SCHEMA } from "../global/config/constants";

import cryptPlugin from "@/plugins/crypt";
import dbPlugin from "@/plugins/db";
import routerPlugin from "@/plugins/router";
import userPlugin from "@/plugins/user";

export default class App {
  public fastify: FastifyInstance;

  constructor() {
    this.fastify = fastify({
      ...this.createLogger()
    })
  }

  public async init() {
    await this.fastify.register(fastifyEnv, {
      schema: ENV_SCHEMA,
      confKey: 'env',
      dotenv: true
    })

    await this.fastify.register(cryptPlugin)
    await this.fastify.register(dbPlugin)
    await this.fastify.register(userPlugin)
    await this.fastify.register(routerPlugin, { prefix: API_PREFIX })
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
      await this.fastify.listen({
        port: parseInt(this.fastify.env.PORT)
      })
    } catch (e) {
      this.fastify.log.error("ERROR: ", e)
      process.exit(1)
    }
  }

}
import { Injectable, OnModuleInit } from "@nestjs/common";

import { createClient, RedisClientType } from 'redis'


@Injectable()
export class RedisService implements OnModuleInit {
  
  private redis: RedisClientType

  async onModuleInit() {
    this.redis = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })
    await this.redis.connect()
  }

  get: RedisClientType['get'] = (...args) => {
    return this.redis.get(...args)
  }

  set: RedisClientType['set'] = (...args) => {
    return this.redis.set(...args)
  }
}
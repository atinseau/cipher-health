import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { createClient, RedisClientType } from 'redis'


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  
  public redis: RedisClientType

  async onModuleInit() {
    this.redis = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })
    await this.redis.connect().then(() => {
      console.log('Redis connected')
    })
  }

  async onModuleDestroy() {
    await this.redis.disconnect()
  }

  get: RedisClientType['get'] = (...args) => {
    return this.redis.get(...args)
  }

  set: RedisClientType['set'] = (...args) => {
    return this.redis.set(...args)
  }

  async cache(cb: () => Promise<any>, options: { key: string, ttl?: number }) {
    const { key, ttl } = options
    const cached = await this.get(key)
    if (cached) {
      return JSON.parse(cached)
    }
    const result = await cb()
    await this.set(key, JSON.stringify(result), {
      ...(ttl && { EX: ttl })
    })
    return result
  }
 }
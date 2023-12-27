import { Injectable } from "@nestjs/common";
import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken'
import { RedisService } from "../redis/redis.service";
import { Logger } from "../logger/logger.service";

@Injectable()
export class JwtService {

  constructor(
    private readonly redisService: RedisService,
    private readonly logger: Logger
  ) { }

  public getAccessTokenExpiry() {
    return process.env.ACCESS_TOKEN_EXPIRY || '10m'
  }

  public getRefreshTokenExpiry() {
    return process.env.REFRESH_TOKEN_EXPIRY || '7d'
  }

  sign<Payload extends Record<string, any>>(
    payload: Payload,
    secret: string,
    options?: SignOptions
  ) {
    return new Promise<string>((resolve) => {

      const defaultOptions: SignOptions = {
        expiresIn: '1h',
        ...options
      }

      sign(payload, secret, defaultOptions, (err, token) => {
        if (err || !token) {
          throw err
        }
        resolve(token)
      })
    })
  }

  verify<T = JwtPayload>(token: string, secret: string) {
    return new Promise<false | T>((resolve) => {
      verify(token, secret, (err, decoded) => {
        if (err || !decoded) {
          resolve(false)
          return
        }
        resolve(decoded as T)
      })
    })
  }

  // Usefull for stored tokens in a database
  async getExpiryDate(token: string, secret: string) {
    const refreshTokenVerified = await this.verify(token, secret)
    if (!refreshTokenVerified) {
      throw new Error('Invalid refresh token')
    }

    const expiresAt = new Date()

    // Get the expiration date from "exp" of the token
    // it will be used later to delete a token that is expired but now soft-deleted
    expiresAt.setTime((refreshTokenVerified.exp || 0) * 1000)

    return expiresAt
  }

  async addToBlacklist(token: string) {
    if (!token) {
      return false
    }

    try {
      await this.redisService.redis.hSet('blacklist', token, 1)
      return true
    } catch (e) {
      this.logger.error(e)
      return false
    }
  }

  async isBlacklisted(token: string) {
    try {
      const result = await this.redisService.redis.hGet('blacklist', token)
      return !!result
    } catch (e) {
      this.logger.error(e)
      return false
    }
  }
}

import { PrismaService } from "@/common/database/prisma.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { Injectable } from "@nestjs/common";
import { User, UserType } from "@prisma/client";
import { v4 as uuid } from 'uuid'
import { UserService } from "../user/user.service";
import { createResult } from "@/utils/errors";
import { Logger } from "@/common/logger/logger.service";
import { CryptoService } from "@/common/crypto/crypto.service";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly loggerService: Logger,
    private readonly cryptoService: CryptoService,
  ) { }

  async createTokens(user: User) {

    const payload = {
      id: user.id,
      cid: uuid() // Correlational ID
    }

    const accessToken = await this.jwtService.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: this.jwtService.getAccessTokenExpiry()
    })
    const refreshToken = await this.jwtService.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: this.jwtService.getRefreshTokenExpiry()
    })

    try {
      const expiresAt = await this.jwtService.getExpiryDate(refreshToken, process.env.REFRESH_TOKEN_SECRET)

      await this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt
        }
      })
    } catch (e) {
      this.loggerService.error(e, 'AuthService')
    }

    return {
      accessToken,
      refreshToken
    }
  }

  async logout(user: User, accessToken: string) {

    if (!user || !accessToken) {
      return createResult(null, false, 'Could not logout for unknown reasons')
    }

    const isCleaned = await this.userService.clearPreviousSessions(user)
    const isBanned = await this.jwtService.addToBlacklist(accessToken)

    if (!isCleaned || !isBanned) {
      return createResult(null, false, 'Could not logout for unknown reasons')
    }
    return createResult(true)
  }

  // Stwt = Signup Token With Type
  async createStwt(type: UserType) {
    try {
      const token = await this.jwtService.sign({
        type,
        cid: uuid() // Correlational ID
      }, process.env.STWT_SECRET, {
        expiresIn: process.env.STWT_EXPIRY || '1d'
      })

      const expiresAt = await this.jwtService.getExpiryDate(token, process.env.STWT_SECRET)
      const stwt = await this.prismaService.stwt.create({
        data: {
          token,
          expiresAt
        }
      })
      return createResult(stwt.token)
    } catch (e) {
      this.loggerService.error(e, 'AuthService')
      return createResult(null, false, 'Could not create the signup token')
    }
  }

  async findStwtByToken(token: string) {
    try {
      const stwt = await this.prismaService.stwt.findUnique({
        where: {
          token
        }
      })

      if (!stwt) {
        return createResult(null, false, {
          type: 'STWT_NOT_FOUND',
          message: 'Could not find the signup token'
        })
      }

      return createResult(stwt)
    } catch (e) {
      this.loggerService.error(e, 'AuthService')
      return createResult(null, false, 'Could not find the signup token')
    }
  }

  async verifyStwt(stwt: string) {
    const stwtResult = await this.jwtService.verify<{ type: UserType }>(stwt, process.env.STWT_SECRET)
    if (!stwtResult) {
      return createResult(null, false, {
        type: 'INVALID_SIGNUP_TOKEN',
        message: 'Invalid signup token'
      })
    }
    return createResult(stwtResult)
  }

  async isUsableStwt(stwt: string) {
    try {
      const stwtResult = await this.verifyStwt(stwt)
      if (!stwtResult.success) {
        return stwtResult
      }

      const stwtInDb = await this.prismaService.stwt.findUnique({
        where: {
          token: stwt,
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (!stwtInDb || stwtInDb.deletedAt) {
        return createResult(null, false, {
          type: 'INVALID_SIGNUP_TOKEN',
          message: 'Invalid signup token'
        })
      }

      return createResult({
        ...stwtResult.data,
        stwt: stwtInDb
      })
    } catch (e) {
      this.loggerService.error(e, 'AuthService')
      return createResult(null, false, 'Unexpected error during signup token verification')
    }
  }

  async deleteStwt(stwt: string, consumerId: string) {
    try {
      await this.prismaService.stwt.update({
        where: {
          token: stwt
        },
        data: {
          deletedAt: new Date(),
          consumerId
        }
      })
    } catch (e) {
      this.loggerService.error(e, 'AuthService')
    }
  }
}
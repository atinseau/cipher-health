import { PrismaService } from "@/common/database/prisma.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { v4 as uuid } from 'uuid'
import { UserService } from "../user/user.service";
import { createResult } from "@/utils/errors";

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
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
      const refreshTokenVerified = await this.jwtService.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      if (!refreshTokenVerified) {
        throw new Error('Invalid refresh token')
      }

      const expiresAt = new Date()

      // Get the expiration date from "exp" of the refresh token
      // it will be used later to delete a refresh token that is expired but now soft-deleted
      expiresAt.setTime((refreshTokenVerified.exp || 0) * 1000)

      await this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt
        }
      })
    } catch (e) {
      console.error(e)
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
      return createResult(null, false,  'Could not logout for unknown reasons')
    }
    return createResult(true)
  }

}
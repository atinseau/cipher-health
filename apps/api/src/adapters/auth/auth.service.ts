import { PrismaService } from "@/common/database/prisma.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { v4 as uuid } from 'uuid'

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async createTokens(user: User) {

    const payload = {
      id: user.id,
      email: user.email,
      cid: uuid() // Correlational ID
    }

    const accessToken = await this.jwtService.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10min'
    })
    const refreshToken = await this.jwtService.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    })

    try {
      await this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
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

}
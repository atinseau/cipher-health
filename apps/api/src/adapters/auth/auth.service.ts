import { JwtService } from "@/common/jwt/jwt.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async createTokens(user: User) {
    const accessToken = await this.jwtService.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '10min'
    })
    const refreshToken = await this.jwtService.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    })
    return {
      accessToken,
      refreshToken
    }
  }

}
import { JwtService } from "@/common/jwt/jwt.service";
import { createHttpError } from "@/utils/errors";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {

    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, 'Please provide an access token by signing in.')
    }

    const result = await this.jwtService.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    if (!result) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, 'Invalid access token.')
    }

    req.body.user = result

    next()
  }
}
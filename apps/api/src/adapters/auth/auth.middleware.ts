import { JwtService } from "@/common/jwt/jwt.service";
import { createRawHttpError } from "@/utils/errors";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Please provide an access token by signing in.')
    }

    const result = await this.jwtService.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
   
    // If the token is invalid/expired or blacklisted, throw an error
    if (!result || await this.jwtService.isBlacklisted(accessToken)) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid access token.')
    }

    req.body.userToken = result
    req.body.accessToken = accessToken

    next()
  }
}
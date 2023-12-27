import { JwtService } from "@/common/jwt/jwt.service";
import { createRawHttpError } from "@/utils/errors";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  async validateRequest(req: Request) {

    // If the user is already authenticated, skip the guard
    // (this is useful for the stwt feature, simulate a user already logged in)
    // "req.userJwt" is set by the StwtGuard
    if (req?.userJwt?.id) {
      return true
    }

    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Please provide an access token by signing in.')
    }

    const result = await this.jwtService.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    // If the token is invalid/expired or blacklisted, throw an error
    if (!result || await this.jwtService.isBlacklisted(accessToken)) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid access token.')
    }

    req.userJwt = result
    req.accessToken = accessToken

    return true
  }
}
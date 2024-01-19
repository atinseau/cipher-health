import { JwtService } from "@/common/jwt/jwt.service";
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { EnableStwtAuth } from "../auth.decorator";
import { AuthService } from "../services/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext) {
    return this.validateRequest(context);
  }

  async validateRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler()
    const classHandler = context.getClass()

    const stwtAuthIsEnabled = !!(this.reflector.get(EnableStwtAuth, handler) || this.reflector.get(EnableStwtAuth, classHandler))
    const { stwt } = req.query as { stwt: string | null }

    // If the method or the controller implements the EnableStwtAuth decorator,
    // check if query param "stwt" is present and valid.
    // If it is, simulate a logged user for the next guards (like a JWT in headers)
    if (stwtAuthIsEnabled && stwt) {
      const stwtResult = await this.authService.verifyStwt(stwt)
      if (!stwtResult.success) {
        await this.authService.cleanupStwtFailProcess(stwt)
        throw createHttpError(stwtResult, {
          INVALID_SIGNUP_TOKEN: HttpStatus.UNAUTHORIZED,
        })
      }

      const tokenResult = await this.authService.findStwtByToken(stwt)

      // Very weird case, the token is valid but not found in the database
      // interseting to know why
      if (!tokenResult.success) {
        throw createHttpError(tokenResult, {
          STWT_NOT_FOUND: HttpStatus.NOT_FOUND
        })
      }

      // Simulate a logged user for the next guards
      // BECAREFUL: consumerId can be null
      // TODO: add a check for this case
      req.userJwt = {
        id: tokenResult.data.consumerId
      }

      // Some STWTs have data attached to them
      // ex: permissions for admins
      if (stwtResult.data?.data) {
        req.stwt = stwtResult.data
      }

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
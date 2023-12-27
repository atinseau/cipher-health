import { createHttpError, createRawHttpError } from "@/utils/errors";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth.service";


@Injectable()
export class StwtGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  async validateRequest(req: Request) {

    const { stwt } = req.query as { stwt: string | null }

    if (stwt) {
      const stwtResult = await this.authService.verifyStwt(stwt)
      if (!stwtResult.success) {
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
      req.userJwt = {
        id: tokenResult.data.consumerId
      }
    }

    return true
  }
}
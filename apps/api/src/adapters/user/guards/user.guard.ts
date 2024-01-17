 import { CanActivate, ExecutionContext, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "../services/user.service";
import { createHttpError, createRawHttpError } from "@/utils/errors";


@Injectable()
export class UserGuard implements CanActivate {

  constructor(
    private readonly userService: UserService
  ) { }
  
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  async validateRequest(req: Request) {

    if (!req.userJwt) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an authenticated user.')
    }

    const result = await this.userService.findById(req.userJwt.id, {
      encryptionProfile: true,
    })

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    req.user = result.data
   
    return true;
  }
}
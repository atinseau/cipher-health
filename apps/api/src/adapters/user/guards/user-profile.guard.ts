import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "../user.service";
import { createRawHttpError } from "@/utils/errors";
import { Reflector } from "@nestjs/core";
import { RequiredProfile } from "../user.decorator";

@Injectable()
export class UserProfileGuard implements CanActivate {

  constructor(
    private readonly userService: UserService,
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request, context.getHandler());
  }

  async validateRequest(req: Request, handler: Function) {

    const requiredProfile = this.reflector.get(RequiredProfile, handler)

    const user = req.user
    if (!user) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an fetched user.')
    }

    const userProfile = await this.userService.findProfileByUserId(user.id)
    if (!userProfile.success && requiredProfile !== undefined) {
      throw createRawHttpError(HttpStatus.NOT_FOUND, 'There is no profile for this user.')
    }

    if (userProfile.success) {
      user.profile = userProfile.data
    }
    return true
  }
}
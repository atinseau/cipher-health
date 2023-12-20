import { CanActivate, ExecutionContext, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user.dto";
import { createRawHttpError } from "@/utils/errors";


@Injectable()
export class UserVerifiedGuard implements CanActivate {

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    return this.validateRequest(user);
  }

  async validateRequest(user?: UserModel) {
    if (!user) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an fetched user.')
    }
    if (!user.verified) {
      throw createRawHttpError(HttpStatus.FORBIDDEN, 'Please verify your account.')
    }

    return true;
  }
}
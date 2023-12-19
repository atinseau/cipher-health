import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user.dto";
import { createRawHttpError } from "@/utils/errors";


@Injectable()
export class UserVerifiedMiddleware implements NestMiddleware {

  async use(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body as { user: UserModel }
    if (!user) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an fetched user.')
    }

    if (!user.verified) {
      throw createRawHttpError(HttpStatus.FORBIDDEN, 'Please verify your account.')
    }
    next()
  }
}
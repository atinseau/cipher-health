 import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../user.service";
import { UserToken } from "../user.dto";
import { createHttpError, createRawHttpError } from "@/utils/errors";


@Injectable()
export class UserMiddleware implements NestMiddleware {

  constructor(
    private readonly userService: UserService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const { userToken } = req.body as { userToken: UserToken }
    if (!userToken) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an authenticated user.')
    }

    const result = await this.userService.findById(userToken.id, {
      encryptionProfile: true
    })

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    req.body.user = result.data
    next()
  }
}
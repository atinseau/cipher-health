import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../user.service";
import { UserModel, UserToken } from "../user.dto";
import { createHttpError, createRawHttpError } from "@/utils/errors";


@Injectable()
export class UserProfileMiddleware implements NestMiddleware {

  /**
   * This array contains all the routes that should throw an error if the user doesn't have a profile
   * in other cases, the middleware will just continue but the profile will be undefined
   */
  private readonly THROWABLE_ROUTES: string[] = []

  constructor(
    private readonly userService: UserService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const { user } = req.body as { user: UserModel }

    const userProfile = await this.userService.findProfileByUserId(user.id)

    const path = req.route.path as string
    if (!userProfile.success && this.THROWABLE_ROUTES.includes(path)) {
      throw createRawHttpError(HttpStatus.NOT_FOUND, 'There is no profile for this user.')
    }

    if (userProfile.success) {
      user.profile = userProfile.data
    }

    next()
  }
}
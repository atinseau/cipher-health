import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.dto";
import { createRawHttpError } from "@/utils/errors";
import { PrismaService } from "@/common/database/prisma.service";


@Injectable()
export class ClientMiddleware implements NestMiddleware {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body as { user: UserModel }
    if (user.type !== "CLIENT") {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route restricted to clients.')
    }

    const client = await this.prismaService.client.findUnique({
      where: {
        userId: user.id
      }
    })
    if (!client) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'There is no client associated with this user.')
    }

    user.client = client
    next()
  }
}
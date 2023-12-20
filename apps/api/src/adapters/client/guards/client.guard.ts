import { CanActivate, ExecutionContext, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import { createRawHttpError } from "@/utils/errors";
import { UserModel } from "@/adapters/user/user.dto";
import { PrismaService } from "@/common/database/prisma.service";


@Injectable()
export class ClientGuard implements CanActivate {

  constructor(
    private readonly prismaService: PrismaService
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user
    return this.validateRequest(user);
  }

  async validateRequest(user?: UserModel) {
    if (!user) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an fetched user.')
    }
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
    return true;
  }
}
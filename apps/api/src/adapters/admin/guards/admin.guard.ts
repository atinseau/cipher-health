import { CanActivate, ExecutionContext, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import { createRawHttpError } from "@/utils/errors";
import { UserModel } from "@/adapters/user/user.dto";
import { PrismaService } from "@/common/database/prisma.service";
import { Reflector } from "@nestjs/core";
import { RequiredAdmin } from "../admin.decorator";


@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly prismaService: PrismaService,
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request, context.getHandler());
  }

  async validateRequest(req: Request, handler: Function) {
    const requiredAdmin = this.reflector.get(RequiredAdmin, handler)
    const user = req.user
    if (!user) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route requires an fetched user.')
    }
    if (user.type !== "ADMIN") {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'This route restricted to administrator.')
    }

    const admin = await this.prismaService.admin.findUnique({
      where: {
        userId: user.id
      }
    })
    
    if (!admin && requiredAdmin !== undefined) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'There is no administrator associated with this user.')
    }

    user.admin = admin
    return true;
  }
}
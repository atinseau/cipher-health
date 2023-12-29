import { CanActivate, ExecutionContext, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";
import { createRawHttpError } from "@/utils/errors";
import { PrismaService } from "@/common/database/prisma.service";
import { Reflector } from "@nestjs/core";
import { RequiredPermissions, RequiredAdmin } from "../admin.decorator";
import { AdminPermission, AdminPermissions } from "../permissions";


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
    const requiredPermissions = this.reflector.get(RequiredPermissions, handler)

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

    // If the method implements the RequiredPermissions decorator,
    // check if the user has all the required permissions.
    // or if the user has the AdminPermissions.ALL permission.
    if (requiredPermissions !== undefined) {

      const permissions = (admin?.permissions || []) as AdminPermission[]
      const hasAllPermissions = permissions.some((permission) => permission === AdminPermissions.ALL.name)
      const hasRequiredPermissions = permissions.every((permission) => requiredPermissions?.includes(permission))

      if (!(hasAllPermissions || hasRequiredPermissions)) {
        throw createRawHttpError(HttpStatus.FORBIDDEN, {
          message: 'This administrator does not have the required permissions.',
          requiredPermissions,
          userPermissions: permissions
        })
      }
    }

    user.admin = admin
    return true;
  }
}
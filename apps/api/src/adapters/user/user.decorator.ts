import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { UserModel } from "./user.dto";
import { Reflector } from "@nestjs/core";

export const User = createParamDecorator<keyof UserModel>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export const RequiredProfile = Reflector.createDecorator()

import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const AccessToken = createParamDecorator<unknown>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.accessToken;
  },
);

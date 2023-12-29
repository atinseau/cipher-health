import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

export const AccessToken = createParamDecorator<unknown>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.accessToken;
  },
);

export const Stwt = createParamDecorator<unknown>(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.stwt;
  },
);



export const EnableStwtAuth = Reflector.createDecorator()
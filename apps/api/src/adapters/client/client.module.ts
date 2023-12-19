import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { JwtService } from "@/common/jwt/jwt.service";
import { UserVerifiedMiddleware } from "../user/middleware/user-verified.middleware";
import { UserMiddleware } from "../user/middleware/user.middleware";
import { ClientMiddleware } from "./client.middleware";

@Module({
  providers: [
    JwtService, // For AuthMiddleware
  ],
  controllers: [
    ClientController
  ]
})
export class ClientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware, // verify token
        UserMiddleware, // fetch user
        UserVerifiedMiddleware, // check if user is verified
        ClientMiddleware, // check if the user type is "client"
      )
      .forRoutes({ path: '/client/me', method: RequestMethod.GET })
  }
}
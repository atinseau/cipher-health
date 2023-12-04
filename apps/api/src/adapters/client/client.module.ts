import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { JwtService } from "@/common/jwt/jwt.service";

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
      .apply(AuthMiddleware)
      .forRoutes({ path: '/client/me', method: RequestMethod.GET })
  }
}
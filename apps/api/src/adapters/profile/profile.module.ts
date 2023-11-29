import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { AuthMiddleware } from "../auth/auth.middleware";
import { JwtService } from "@/common/jwt/jwt.service";

@Module({
  providers: [
    JwtService, // For AuthMiddleware
  ],
  controllers: [
    ProfileController
  ]
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/profile/me', method: RequestMethod.GET })
  }
}
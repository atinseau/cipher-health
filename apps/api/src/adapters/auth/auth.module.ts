

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "./auth.service";
import { AuthMiddleware } from "./auth.middleware";

@Module({
  providers: [
    CryptoService,
    JwtService,
    AuthService,
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/auth/refresh', method: RequestMethod.POST })
  }
}
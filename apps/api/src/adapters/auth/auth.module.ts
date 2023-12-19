

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "./auth.service";
import { AuthMiddleware } from "./auth.middleware";
import { VerifyController } from "./controllers/verify.controller";
import { UserMiddleware } from "../user/middleware/user.middleware";
import { RandomService } from "@/common/random/random.service";

@Module({
  providers: [
    CryptoService,
    JwtService,
    AuthService,
    RandomService,
  ],
  controllers: [
    AuthController,
    VerifyController,
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware, // check the token
        UserMiddleware // find the user
      )
      .forRoutes(
        { path: '/auth/signout', method: RequestMethod.GET },
        { path: '/auth/verify', method: RequestMethod.GET },
        { path: '/auth/verify/callback', method: RequestMethod.POST }
      );
  }
}
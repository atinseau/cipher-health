

import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "./services/auth.service";
import { VerifyController } from "./controllers/verify.controller";
import { RandomService } from "@/common/random/random.service";
import { AuthTasks } from "./auth.tasks";
import { VerifyService } from "./services/verify.service";

@Module({
  providers: [
    AuthTasks,
    CryptoService,
    JwtService,
    AuthService,
    RandomService,
    VerifyService,
  ],
  controllers: [
    AuthController,
    VerifyController,
  ]
})
export class AuthModule { }
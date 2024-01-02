

import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "./auth.service";
import { VerifyController } from "./controllers/verify.controller";
import { RandomService } from "@/common/random/random.service";
import { AuthTasks } from "./auth.tasks";

@Module({
  providers: [
    AuthTasks,
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
export class AuthModule { }
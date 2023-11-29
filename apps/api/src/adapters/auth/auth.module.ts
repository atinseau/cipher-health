

import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "./auth.service";

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
export class AuthModule { }
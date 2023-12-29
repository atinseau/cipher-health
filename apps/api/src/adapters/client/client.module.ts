import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "../auth/auth.service";
import { CryptoService } from "@/common/crypto/crypto.service";

@Module({
  providers: [
    AuthService, // For AuthGuard
    CryptoService, // For AuthGuard
    JwtService, // For AuthGuard
  ],
  controllers: [
    ClientController
  ]
})
export class ClientModule { }
import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "../auth/services/auth.service";
import { CryptoService } from "@/common/crypto/crypto.service";

@Module({
  controllers: [AdminController],
  providers: [
    JwtService, // AdminGuard
    CryptoService, // AuthService requirement
    AuthService,
    AdminService,
  ],
  exports: [AdminService]
})
export class AdminModule {}
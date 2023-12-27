import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { JwtService } from "@/common/jwt/jwt.service";
import { AuthService } from "../auth/auth.service";

@Module({
  controllers: [AdminController],
  providers: [
    JwtService, // AdminGuard
    AuthService,
    AdminService,
  ],
  exports: [AdminService]
})
export class AdminModule {}
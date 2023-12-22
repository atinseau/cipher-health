import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { JwtService } from "@/common/jwt/jwt.service";

@Module({
  controllers: [AdminController],
  providers: [
    JwtService, // AdminGuard
    AdminService,
  ],
  exports: [AdminService]
})
export class AdminModule {}
import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { JwtService } from "@/common/jwt/jwt.service";

@Module({
  providers: [
    JwtService, // For AuthGuard
  ],
  controllers: [
    ClientController
  ]
})
export class ClientModule { }
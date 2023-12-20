import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { UserModel } from "../user/user.dto";
import { UserService } from "../user/user.service";
import { UserGuard } from "../user/guards/user.guard";
import { UserVerifiedGuard } from "../user/guards/user-verified.guard";
import { ClientGuard } from "./guards/client.guard";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(
  AuthGuard,
  UserGuard,
  UserVerifiedGuard,
  ClientGuard
)
@Controller('client')
export class ClientController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('/me')
  async me(@Body('user') user: UserModel) {
    return {
      success: true,
      data: this.userService.sanitize(user)
    }
  }
}
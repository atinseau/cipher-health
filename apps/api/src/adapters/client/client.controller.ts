import { Body, Controller, Get } from "@nestjs/common";
import { UserModel } from "../user/user.dto";
import { UserService } from "../user/user.service";

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
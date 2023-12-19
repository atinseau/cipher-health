import { Body, Controller, Get, HttpStatus } from "@nestjs/common";
import { UserModel, UserToken } from "../user/user.dto";
import { UserService } from "../user/user.service";
import { createHttpError } from "@/utils/errors";

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
import { Body, Controller, Get, HttpStatus } from "@nestjs/common";
import { UserToken } from "../user/user.dto";
import { UserService } from "../user/user.service";
import { createHttpError } from "@/utils/errors";

@Controller('client')
export class ClientController {

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('/me')
  async me(@Body('user') user: UserToken) {
    const result = await this.userService.findById(user.id, {
      encryptionProfile: true
    })
    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    return {
      success: true,
      data: this.userService.sanitize(result.data)
    }
  }
}
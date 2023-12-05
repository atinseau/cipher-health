import { RedisService } from "@/common/redis/redis.service";
import { Body, Controller, Get, HttpStatus } from "@nestjs/common";
import { UserToken } from "../user/user.dto";
import { UserService } from "../user/user.service";
import { createHttpError } from "@/utils/errors";
import { omit } from "lodash";

@Controller('client')
export class ClientController {

  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) { }

  @Get('/me')
  async me(@Body('user') user: UserToken) {
    const result = await this.userService.findByEmail(user.email)
    if (!result.success) {
      throw createHttpError(result, {
        UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    return {
      success: true,
      data: omit(result.data, [
        'password'
      ])
    }
  }
}
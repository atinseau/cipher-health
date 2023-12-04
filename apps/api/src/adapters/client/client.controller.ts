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
      if (typeof result.error !== 'string' && result.error.type === 'USER_NOT_FOUND')
        throw createHttpError(HttpStatus.NOT_FOUND, result.error.message)
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, result.error)
    }

    return {
      success: true,
      data: omit(result.data, [
        'password'
      ])
    }
  }
}
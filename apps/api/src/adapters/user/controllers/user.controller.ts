import { Body, Controller, Get, HttpStatus, Patch, Post } from "@nestjs/common";
import { UserModel } from "../user.dto";
import { UserService } from "../user.service";
import { profileCreationSchema } from "../profile.schema";
import { createHttpError, createRawHttpError } from "@/utils/errors";



@Controller('user')
export class UserController {

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

  @Post('profile/create')
  async createProfile(@Body() body: any) {
    const { user, ...payload } = body as { user: UserModel } & Record<string, any>

    if (user.profile) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'This user already has a profile.')
    }


    const output = profileCreationSchema.safeParse(payload)
    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.createProfile(user, output.data)
    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
      })
    }

    return {
      success: true,
      data: result.data
    }
  }

}
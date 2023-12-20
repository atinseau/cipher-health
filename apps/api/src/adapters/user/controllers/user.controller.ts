import { Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { UserModel } from "../user.dto";
import { UserService } from "../user.service";
import { profileCreationSchema } from "../profile.schema";
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { UserGuard } from "../guards/user.guard";
import { UserVerifiedGuard } from "../guards/user-verified.guard";
import { RequiredProfile, User } from "../user.decorator";
import { UserProfileGuard } from "../guards/user-profile.guard";
import { AuthGuard } from "@/adapters/auth/guards/auth.guard";



@UseGuards(
  AuthGuard,
  UserGuard,
  UserVerifiedGuard,
  UserProfileGuard
)
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) { }


  @Get('/me')
  async me(@User() user: UserModel) {
    return {
      success: true,
      data: this.userService.sanitize(user)
    }
  }

  @Post('profile/create')
  async createProfile(
    @User() user: UserModel,
    @Body() body: any
  ) {
    if (user.profile) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'This user already has a profile.')
    }

    const output = profileCreationSchema.safeParse(body)
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
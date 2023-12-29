import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserModel } from "../user.dto";
import { UserService } from "../user.service";
import { profileCreationSchema } from "../profile.schema";
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { UserGuard } from "../guards/user.guard";
import { UserVerifiedGuard } from "../guards/user-verified.guard";
import { User } from "../user.decorator";
import { UserProfileGuard } from "../guards/user-profile.guard";
import { AuthGuard } from "@/adapters/auth/guards/auth.guard";
import { EnableStwtAuth, Stwt } from "@/adapters/auth/auth.decorator";
import { IStwt } from "@/adapters/auth/auth.dto";
import { AdminService } from "@/adapters/admin/admin.service";

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
    private readonly adminService: AdminService,
  ) { }


  @Get('/me')
  async me(@User() user: UserModel) {
    return {
      success: true,
      data: this.userService.sanitize(user)
    }
  }

  @Post('profile/create')
  @EnableStwtAuth()
  async createProfile(
    @User() user: UserModel,
    @Body() body: any,
    @Stwt() stwt?: IStwt
  ) {
    if (user.profile) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'This user already has a profile.')
    }

    const output = profileCreationSchema.safeParse(body)
    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    // Ask profile creation for admin user by stwt method
    if (stwt && stwt.type === 'ADMIN') {

      // const result = await this.adminService.createAdmin({
      //   profile: output.data,
        
      // })

      // CREATE ADMIN PROFILE HERE

      return
    }

    // Other type of user
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
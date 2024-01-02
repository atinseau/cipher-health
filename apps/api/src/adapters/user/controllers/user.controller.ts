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
    // TODO: improve this guard by checking "completed" field instead of profile existence
    if (user.profile) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'This user already has a profile.')
    }

    const output = profileCreationSchema.safeParse(body)
    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    // Ask profile creation for admin user by stwt method
    if (stwt && stwt.type === 'ADMIN') {

      const result = await this.adminService.createAdmin({
        profile: output.data,
        admin: {
          // if permissions is provided in stwt data, use it, otherwise use empty array
          permissions: stwt.data?.permissions || [],
          // if creatorId is provided in stwt data, use it, otherwise use null
          creatorId: stwt.data?.creatorId || null,
        },
        user
      })

      if (!result.success) {
        throw createHttpError(result, {
          USER_NOT_FOUND: HttpStatus.NOT_FOUND,
          // The next errors should never happen because user is already created
          // and verified, it's a side effect of "createAdmin" method that can also
          // create a user if it doesn't exist
          DUPLICATE_PHONE: HttpStatus.INTERNAL_SERVER_ERROR,
          DUPLICATE_EMAIL: HttpStatus.INTERNAL_SERVER_ERROR,
          PHONE_FORMAT_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
        })
      }

      return {
        success: true,
        data: result.data
      }
    }

    // Other type of user
    const result = await this.userService.createProfile(user.id, output.data)
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
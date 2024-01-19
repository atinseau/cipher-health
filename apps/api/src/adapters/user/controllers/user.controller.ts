import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserModel } from "../user.dto";
import { UserService } from "../services/user.service";
import { profileCreationSchema } from "../profile.schema";
import { createRawHttpError } from "@/utils/errors";
import { UserGuard } from "../guards/user.guard";
import { UserVerifiedGuard } from "../guards/user-verified.guard";
import { User } from "../user.decorator";
import { UserProfileGuard } from "../guards/user-profile.guard";
import { AuthGuard } from "@/adapters/auth/guards/auth.guard";
import { EnableStwtAuth, Stwt } from "@/adapters/auth/auth.decorator";
import { IStwt } from "@/adapters/auth/auth.dto";
import { ProfileService } from "../services/profile.service";
import { clientMedicalInformationSchema } from "@cipher-health/utils/schemas";

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
    private readonly profileService: ProfileService,
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
      return this.profileService.createAdminProfile(output.data, user, stwt)
    }

    if (stwt && stwt.type === 'WORKER') {
      throw new Error('Not implemented')
    }

    // In any other case, create a client profile
    const clientOutput = clientMedicalInformationSchema.safeParse(body)
    if (!clientOutput.success) {
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, clientOutput.error.errors)
    }
    return this.profileService.createClientProfile({ ...output.data, ...clientOutput.data }, user)
  }

}
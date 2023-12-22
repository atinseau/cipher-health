import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserGuard } from "../user/guards/user.guard";
import { UserVerifiedGuard } from "../user/guards/user-verified.guard";
import { AdminGuard } from "./guards/admin.guard";
import { User } from "../user/user.decorator";
import { UserModel } from "../user/user.dto";
import { UserProfileGuard } from "../user/guards/user-profile.guard";
import { UserService } from "../user/user.service";

@UseGuards(
  AuthGuard,
  UserGuard,
  UserVerifiedGuard,
  UserProfileGuard,
  AdminGuard,
)
@Controller('admin')
export class AdminController {

  constructor(
    private readonly userService: UserService,
  ) {}

  /**
   * Due to the AdminGuard, this admin profile will be automatically
   * fetched from the database and attached to the user object.
   */
  @Get('me')
  async getMeAsAdmin(@User() user: UserModel) {
    return {
      success: true,
      data: this.userService.sanitize(user)
    }
  }

}
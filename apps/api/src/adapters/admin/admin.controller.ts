import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserGuard } from "../user/guards/user.guard";
import { UserVerifiedGuard } from "../user/guards/user-verified.guard";
import { AdminGuard } from "./guards/admin.guard";
import { User } from "../user/user.decorator";
import { UserModel } from "../user/user.dto";
import { UserProfileGuard } from "../user/guards/user-profile.guard";
import { UserService } from "../user/user.service";
import { AdminService } from "./admin.service";
import { ListQuery, IListQuery } from "@/utils/decorators/searchQuery";

@UseGuards(
  AuthGuard,
  UserGuard,
  AdminGuard,
  UserVerifiedGuard,
  UserProfileGuard,
)
@Controller('admin')
export class AdminController {

  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
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


  @Get('all')
  async getAdmins(@ListQuery() listQuery: IListQuery) {

    console.log(listQuery)

    const admins = await this.adminService.findAll()

    return {
      success: true,
      data: admins.data.map((admin) => this.userService.sanitize(admin))
    }
  }

}
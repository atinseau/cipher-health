import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
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
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { RequiredPermissions } from "./admin.decorator";
import { inviteAdminSchema } from "./admin.schema";
import { AuthService } from "../auth/auth.service";
import { MailService } from "@/common/mail/mail.service";
import { Logger } from "@/common/logger/logger.service";
import { InviteAdminEmail } from "@/common/mail/templates";
import { AdminPermissions } from "./permissions";

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
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly loggerService: Logger,
    private readonly adminService: AdminService,
  ) { }

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
    const admins = await this.adminService.findAll()
    return {
      success: true,
      data: admins.data.map((admin) => this.userService.sanitize(admin))
    }
  }

  @Get('permissions')
  @RequiredPermissions([
    'GET_PERMISSIONS'
  ])
  async getPermissions() {
    return {
      success: true,
      data: Object.values(AdminPermissions)
    }
  }

  @Get(':id')
  async getAdminById(@Param('id') id: string) {
    const admin = await this.adminService.findById(id)
    if (!admin.success) {
      throw createHttpError(admin, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }
    return {
      success: true,
      data: this.userService.sanitize(admin.data)
    }
  }

  @Post('invite')
  @RequiredPermissions([
    'INVITE',
  ])
  async inviteAdmin(@User() user: UserModel, @Body() body: any) {

    const payload = inviteAdminSchema.safeParse(body)
    if (!payload.success) {
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, payload.error.issues)
    }

    // Verify that user as the right to give thoses permissions to the new admin
    // TODO: do that

    const result = await this.userService.findByEmail(payload.data.email)
    if (result.success) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'This email is already registered')
    }

    // Add the permissions to the payload for the futur when
    // the admin will signup with the invitation link, we will 
    // attach the permissions to his account.
    const stwtResult = await this.authService.createStwt('ADMIN', {
      permissions: payload.data.permissions
    })
    if (!stwtResult.success) {
      throw createHttpError(stwtResult)
    }

    try {
      await this.mailService.send({
        to: payload.data.email,
        component: InviteAdminEmail,
        componentProps: {
          url: `${process.env.ADMIN_PANEL_URL}/admin/signup?stwt=${stwtResult.data}`
        }
      })
    } catch (e) {
      this.loggerService.error(e, 'AdminController')
      throw createRawHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Could not send the invitation email')
    }

    return {
      success: true,
      data: 'The invitation has been sent successfully.'
    }
  }
}
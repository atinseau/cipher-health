import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: Logger,
    private readonly userService: UserService,
  ) { }

  async onApplicationBootstrap() {
    const admin = await this.prismaService.user.findFirst({
      where: {
        type: 'ADMIN'
      }
    })

    if (!admin) {
      this.loggerService.log('There is no admin user in the database. Initialize one now...', 'AdminService')
      const result = await this.userService.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        verified: true,
        phone: '+33000000000',
        type: 'ADMIN',
      })
      if (!result.success) {
        this.loggerService.error(result.error.message, 'AdminService')
        return
      }
      this.loggerService.log('Admin user initialized', 'AdminService')
    }
  }

}
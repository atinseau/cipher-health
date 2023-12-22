import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ProfileCreate, UserCreate, UserModel } from "../user/user.dto";
import { createResult } from "@/utils/errors";
import { AdminCreate } from "./admin.dto";

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
      const result = await this.createAdmin({
        user: {
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          verified: true,
          phone: '+33000000000',
          type: 'ADMIN',
        },
        // This is a completed fake profile
        profile: {
          firstName: 'Admin',
          lastName: 'Admin',
          address: 'Admin',
          addressDetails: 'Admin',
          birthDate: new Date(),
          birthName: 'Admin',
          birthPlace: 'Admin',
          city: 'Admin',
          country: 'FR',
          gender: 'MALE',
          zipCode: '00000',
        }
      })
      if (!result.success) {
        this.loggerService.error(result.error.message, 'AdminService')
        return
      }
      this.loggerService.log('Admin user initialized', 'AdminService')
    }
  }


  /**
   * Always attach the admin profile to the user object
   * an admin cannot be created without is "typed" profile (admin here) relation instead of the
   * other user types (client, worker)
   * 
   * He can't also be created without the "profile" relation that contains all the
   * user information (lastname, firstname, etc...)
   */
  async createAdmin(userCreation: { user: UserCreate, profile: ProfileCreate, admin?: Partial<AdminCreate> }) {
    const result = await this.userService.create(userCreation.user)
    if (!result.success) {
      return result
    }

    const profile = this.userService.createProfile(result.data as UserModel, userCreation.profile)
    const admin = this.prismaService.admin.create({
      data: {
        userId: result.data.id,
        permissions: userCreation.admin?.permissions || [],
      }
    })

    const [profileResult, adminResult] = await Promise.all([profile, admin])

    if (!adminResult || !profileResult.success) {
      return createResult(null, false, 'Cannot create admin')
    }

    const userModel = result.data as UserModel

    userModel.profile = profileResult.data
    userModel.admin = adminResult

    return createResult(userModel)
  }


  async findAll() {
    const admins = await this.prismaService.user.findMany({
      include: {
        profile: true,
        admin: true,
      },
      where: {
        type: 'ADMIN',
        profile: {
          id: {
            not: undefined
          }
        },
        admin: {
          id: {
            not: undefined
          }
        }
      }
    })
    return createResult(admins as UserModel[])
  }
}
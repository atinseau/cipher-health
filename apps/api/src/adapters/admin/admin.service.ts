import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ProfileCreate, UserCreate, UserModel } from "../user/user.dto";
import { createResult } from "@/utils/errors";
import { AdminCreate } from "./admin.dto";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
          phone: '06-06-06-06-06', // fake valid phone number
          type: 'ADMIN',
          verified: true, // Initial admin is always verified
          completed: true, // Inital admin is always completed
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
        },
        admin: {
          permissions: ['*']
        }
      })
      if (!result.success) {
        this.loggerService.error(result.error.message, 'AdminService')
        return
      }
      this.loggerService.log('Admin user initialized', 'AdminService')
    }
  }

  private async createStandaloneAdmin(userId: string, adminCreation?: Partial<AdminCreate>) {
    try {
      const admin = await this.prismaService.admin.create({
        data: {
          userId,
          permissions: adminCreation?.permissions || [],
          creatorId: adminCreation?.creatorId || null,
        }
      })
      return createResult(admin)
    } catch (e) {
      this.loggerService.error(e, 'AdminService')
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'User not found'
        })
      }
      return createResult(null, false, e.message as string)
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
  async createAdmin(userCreation: {
    user: UserCreate | User,
    profile: ProfileCreate,
    admin?: Partial<AdminCreate>
  }) {
    // TODO: add try catch here

    let user: User

    // If the "userCreation.user" contains an id, it means that the user already exists
    // and we just need to attach the admin profile to it
    if ('id' in userCreation.user) {
      user = userCreation.user
    } else {
      const result = await this.userService.create(userCreation.user)
      if (!result.success) {
        return result
      }
      user = result.data
    }

    const profile = this.userService.createProfile(user.id, userCreation.profile)
    const admin = this.createStandaloneAdmin(user.id, userCreation.admin)

    const [profileResult, adminResult] = await Promise.all([profile, admin])

    if (!adminResult.success) {
      return adminResult
    }

    if (!profileResult.success) {
      return profileResult
    }

    const userModel = user as UserModel

    userModel.profile = profileResult.data
    userModel.admin = adminResult.data

    // Set user as completed when profile and admin are created for this user
    if (!userModel.completed) {
      await this.prismaService.user.update({
        where: {
          id: user.id
        },
        data: {
          completed: true
        }
      })
    }

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

  async findById(id: string) {
    try {
      const admin = await this.userService.findById(id, {
        admin: true,
        profile: true,
      })
      if (!admin.success) {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'Cannot find admin'
        })
      }
      return createResult(admin.data as UserModel)
    } catch (e) {
      return createResult(null, false, e.message as string)
    }
  }
}
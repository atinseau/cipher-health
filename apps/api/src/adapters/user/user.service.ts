import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { UserCreate, UserModel } from "./user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CryptoService } from "@/common/crypto/crypto.service";
import { createResult } from "@/utils/errors";
import { Prisma, User } from "@prisma/client";
import { merge, omit, omitBy } from "lodash";
import { profileCreationSchema } from "./profile.schema";
import { z } from "zod";

@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly loggerService: Logger
  ) { }

  /**
   * The password type checking should be done in the function that calls this one
   * that why we force the password to be defined here
   */
  async create(user: UserCreate & { password: string }) {
    try {
      const result = await this.prismaService.user.create({
        data: {
          ...user,
          // Password will always be defined here because of the schema
          password: await this.cryptoService.hash(user.password),
        }
      })
      return createResult(result)
    } catch (e) {

      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return createResult(null, false, {
          type: 'DUPLICATE_EMAIL',
          message: 'Email already exists'
        })
      }

      this.loggerService.error(e)
      return createResult(null, false, e.message as string)
    }
  }

  private async find(where: Prisma.UserWhereUniqueInput, include: Prisma.UserInclude = {}) {
    try {
      const result = await this.prismaService.user.findUnique({
        where,
        include: {
          ...include
        },
      })
      if (!result) {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'User not found'
        })
      }
      return createResult(result)
    } catch (e) {
      this.loggerService.error(e)
      return createResult(null, false, e.message as string)
    }
  }

  private async update(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    try {
      const result = await this.prismaService.user.update({
        where,
        data
      })
      return createResult(result)
    } catch (e) {
      this.loggerService.error(e)
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'User not found'
        })
      }
      return createResult(null, false, e.message as string)
    }
  }

  async findById(id: string, include?: Prisma.UserInclude) {
    return this.find({
      id,
    }, include)
  }

  async findByEmail(email: string, include?: Prisma.UserInclude) {
    return this.find({
      email
    }, include)
  }

  async updateById(id: string, data: Prisma.UserUpdateInput) {
    return this.update({
      id
    }, data)
  }

  async findProfileByUserId(userId: string) {
    try {
      const result = await this.prismaService.profile.findUnique({
        where: {
          userId
        }
      })
      if (!result) {
        return createResult(null, false, {
          type: 'PROFILE_NOT_FOUND',
          message: 'There is no profile for this user'
        })
      }
      return createResult(result)
    } catch (e) {
      this.loggerService.error(e)
      return createResult(null, false, e.message as string)
    }
  }

  async createProfile(user: UserModel, payload: z.infer<typeof profileCreationSchema>) {
    try {
      const result = await this.prismaService.profile.create({
        data: {
          ...payload,
          userId: user.id
        }
      })

      // update the user status to TYPED_PROFILE_PENDING
      // common profile is successfull created so only the specific fields due to the user type
      // is missing
      const updateResult = await this.updateById(user.id, {
        status: 'TYPED_PROFILE_PENDING'
      })

      if (!updateResult.success) {
        return updateResult
      }

      return createResult(result)
    } catch (e) {
      this.loggerService.error(e)
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'User not found'
        })
      }
      return createResult(null, false, e.message as string)
    }
  }

  async clearPreviousSessions(user: User) {
    try {
      await this.prismaService.refreshToken.updateMany({
        where: {
          userId: user.id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        }
      })
      return true
    } catch (e) {
      this.loggerService.error(e)
      return false
    }
  }

  sanitize(user: UserModel) {

    // Reduce the size of the encryption profile to convert the buffers to hex strings
    if (user.encryptionProfile) {
      // prevent sending to client a buffer instead of hex string (more readable)
      merge(user.encryptionProfile, {
        recoveryKey: user.encryptionProfile.recoveryKey.toString('hex'),
        userKey: user.encryptionProfile.userKey.toString('hex')
      })
      // @ts-ignore
      user.encryptionProfile = omit(user.encryptionProfile, [
        'userId',
        'recoveryKey',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ])
    }

    if (user.profile) {
      // @ts-ignore
      user.profile = omit(user.profile, [
        'id',
        'createdAt',
        'updatedAt',
        'userId'
      ])
    }

    const cleanedUser = omit(user, [
      'password',
      'refreshTokens', // manually populate with include property
      'verified',
      'verificationToken',
      'lastVerificationRequest',
      'status',
      'type',
      'deletedAt',
    ])

    return omitBy(cleanedUser, (value) => value === null)
  }
}
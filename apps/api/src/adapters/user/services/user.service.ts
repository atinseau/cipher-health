import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { UserCreate, UserModel } from "../user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CryptoService } from "@/common/crypto/crypto.service";
import { createResult } from "@/utils/errors";
import { Prisma, User, UserType } from "@prisma/client";
import { merge, omit, omitBy } from "lodash";
import { profileCreationSchema } from "../profile.schema";
import { z } from "zod";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { PhoneService } from "@/common/phone/phone.service";

@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly phoneService: PhoneService,
    private readonly loggerService: Logger,
    private readonly eventEmitter: EventEmitter2
  ) { }

  /**
   * This function is called when the user is created
   * If the user is an admin, he can be verified or not
   * if the admin don't need to be verified, the status is set to PROFILE_PENDING
   * 
   * if the user is not an admin, he must be verified by email in any case
   */
  private getInitalValue(type: UserType, user: UserCreate): Partial<User> {
    if (type === 'ADMIN') {
      return {
        verified: user?.verified || false,
        completed: user?.completed || false,
      }
    }

    return {
      verified: false,
      completed: false,
    }
  }

  async create(userCreate: UserCreate) {
    try {
      const {
        country = 'FR',
        type = 'CLIENT',
        ...user
      } = userCreate

      const phone = this.phoneService.formatPhone(user.phone, country)

      if (!phone) {
        return createResult(null, false, {
          type: 'PHONE_FORMAT_ERROR',
          message: 'Invalid phone number'
        })
      }

      const result = await this.prismaService.user.create({
        data: {
          ...user,
          ...this.getInitalValue(type, user),
          phone,
          type,
          // Password will always be defined here because of the schema
          password: await this.cryptoService.hash(user.password),
        }
      })

      this.eventEmitter.emit('user.created', result)

      return createResult(result)
    } catch (e) {

      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {

        const target = e?.meta?.target as string[] | undefined

        if (target?.includes('phone')) {
          return createResult(null, false, {
            type: 'DUPLICATE_PHONE',
            message: 'Phone number already exists'
          })
        }
        
        return createResult(null, false, {
          type: 'DUPLICATE_EMAIL',
          message: 'Email already exists'
        })
      }

      this.loggerService.error(e, 'UserService')
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
      this.loggerService.error(e, 'UserService')
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
      this.loggerService.error(e, 'UserService')
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
      this.loggerService.error(e, 'UserService')
      return createResult(null, false, e.message as string)
    }
  }

  async createProfile(userId: string, payload: z.infer<typeof profileCreationSchema>) {
    try {
      const result = await this.prismaService.profile.create({
        data: {
          ...payload,
          
          userId
        }
      })
      return createResult(result)
    } catch (e) {
      this.loggerService.error(e, 'UserService')
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
      this.loggerService.error(e, 'UserService')
      return false
    }
  }

  sanitize(user: UserModel) {
    const BASE_RELATION_REMOVED_FIELDS = [
      'id',
      'userId',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ]

    // Reduce the size of the encryption profile to convert the buffers to hex strings
    if (user?.encryptionProfile) {
      // prevent sending to client a buffer instead of hex string (more readable)
      merge(user.encryptionProfile, {
        recoveryKey: user.encryptionProfile.recoveryKey.toString('hex'),
        userKey: user.encryptionProfile.userKey.toString('hex')
      })
      // @ts-ignore
      user.encryptionProfile = omit(user.encryptionProfile, [
        ...BASE_RELATION_REMOVED_FIELDS,
        'recoveryKey',
      ])
    }

    if (user?.profile) {
      // @ts-ignore
      user.profile = omit(user.profile, BASE_RELATION_REMOVED_FIELDS)
    }

    if (user?.client) {
      // @ts-ignore
      user.client = omit(user.client, BASE_RELATION_REMOVED_FIELDS)
    }

    if (user?.admin) {
      // @ts-ignore
      user.admin = omit(user.admin, BASE_RELATION_REMOVED_FIELDS)
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
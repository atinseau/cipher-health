import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { UserCreate } from "./user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CryptoService } from "@/common/crypto/crypto.service";
import { createResult } from "@/utils/errors";
import { Prisma, User } from "@prisma/client";
import { omit } from "lodash";

@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly loggerService: Logger
  ) { }

  async create(user: UserCreate) {
    try {
      const result = await this.prismaService.user.create({
        data: {
          ...user,
          // Password will always be defined here because of the schema
          password: await this.cryptoService.hash(user.password!)
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

  private async find(where: Prisma.UserWhereUniqueInput) {
    try {
      const result = await this.prismaService.user.findUnique({
        where,
        include: {
          refreshTokens: {
            where: {
              deletedAt: null
            }
          },
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

  async findById(id: string) {
    return this.find({
      id,
    })
  }

  async findByEmail(email: string) {
    return this.find({
      email
    })
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

  sanitize(user: User) {
    return omit(user, [
      'password',
      'refreshTokens',
      'type',
      'deletedAt',
    ])
  }
}
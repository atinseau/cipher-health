import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { UserCreate } from "./user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CryptoService } from "@/common/crypto/crypto.service";
import { UnwrapError, createResult } from "@/utils/errors";
import { Prisma, User } from "@prisma/client";
import { merge, omit } from "lodash";

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

      // create the encryption profile with the keys
      // recovery key and user key that is both able to decrypt the encryption key
      const encryptionProfile = await this.cryptoService.createEncryptionProfil(user.password)

      // Create and attach the encryption profile to the user
      await this.prismaService.encryptionProfile.create({
        data: {
          userId: result.id,
          ...encryptionProfile.keys
        }
      })

      const encryptedPassphrase = await this.cryptoService.encrypt(encryptionProfile.passphrase, user.password)

      return createResult({
        user: result,
        // to prevent man in the middle attach, we encrypt the passphrase with the user password before sending it
        passphrase: encryptedPassphrase.toString('hex')
      })
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

  sanitize(user: UnwrapError<AsyncReturnType<typeof this.find>>) {

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

    return omit(user, [
      'password',
      'refreshTokens', // manually populate with include property
      'type',
      'deletedAt',
    ])
  }
}
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserModel } from "../user.dto";
import { createRawHttpError } from "@/utils/errors";
import { CryptoService } from "@/common/crypto/crypto.service";
import { PrismaService } from "@/common/database/prisma.service";
import { UserGuard } from "../guards/user.guard";
import { UserVerifiedGuard } from "../guards/user-verified.guard";
import { AuthGuard } from "@/adapters/auth/guards/auth.guard";
import { User } from "../user.decorator";



@UseGuards(
  AuthGuard,
  UserGuard,
  UserVerifiedGuard
)
@Controller('user/encryption')
export class UserEncryptionController {

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly prismaService: PrismaService,
  ) { }

  /**
   * This endpoint is used to create the encryption profile
   * for the user. It will create the encryption profile
   * and attach it to the user.
   */
  @Post('profile/create')
  @HttpCode(201)
  async createEncryptionProfile(
    @User() user: UserModel,
    @Body('password') password: string
  ) {

    if (!password) {
      throw createRawHttpError(HttpStatus.BAD_REQUEST, 'Password is required')
    }

    if (user.encryptionProfile) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'Encryption profile already exists')
    }

    // create the encryption profile with the keys
    // recovery key and user key that is both able to decrypt the encryption key
    const encryptionProfile = await this.cryptoService.createEncryptionProfil(password)

    // Create and attach the encryption profile to the user
    await this.prismaService.encryptionProfile.create({
      data: {
        userId: user.id,
        ...encryptionProfile.keys
      }
    })

    // return the encrypted passphrase to prevent man in the middle attack
    // only the user will be able to decrypt the passphrase with his password
    const encryptedPassphrase = await this.cryptoService.encrypt(encryptionProfile.passphrase, password)
    return {
      success: true,
      data: {
        passphrase: encryptedPassphrase.toString('hex'),
      }
    }
  }

}
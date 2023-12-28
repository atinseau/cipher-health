import { UserGuard } from "@/adapters/user/guards/user.guard";
import { User } from "@/adapters/user/user.decorator";
import { UserModel } from "@/adapters/user/user.dto";
import { UserService } from "@/adapters/user/user.service";
import { CryptoService } from "@/common/crypto/crypto.service";
import { PhoneService } from "@/common/phone/phone.service";
import { RandomService } from "@/common/random/random.service";
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { StwtGuard } from "../guards/stwt.guard";
import { dateIsExpired } from "@cipher-health/utils";


@UseGuards(
  StwtGuard,
  AuthGuard,
  UserGuard,
)
@Controller('auth/verify')
export class VerifyController {

  constructor(
    private readonly phoneService: PhoneService,
    private readonly cryptoService: CryptoService,
    private readonly randomService: RandomService,
    private readonly userService: UserService,
  ) { }

  @Get()
  async verify(@User() user: UserModel) {

    if (user.verified) {
      throw createRawHttpError(HttpStatus.BAD_REQUEST, 'User already verified')
    }

    // check if the last verification request was less than 1 minute ago
    // to prevent spamming and excessive use of the service (only in production)
    if (process.env.NODE_ENV === 'production' && user.lastVerificationRequest) {

      const now = new Date()
      const diff = now.getTime() - user.lastVerificationRequest.getTime()
      if (diff < 60 * 1000) {
        throw createRawHttpError(HttpStatus.TOO_MANY_REQUESTS, 'Too many requests')
      }
    }

    const code = this.randomService.createNumeric(6)
    const hashedCode = await this.cryptoService.hash(code)

    // update the user verification code with the hashed code
    const result = await this.userService.updateById(user.id, {
      verificationToken: hashedCode,
      lastVerificationRequest: new Date()
    })

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    // send the code to the user
    const sendingResult = await this.phoneService.send({
      body: `Your verification code is ${code}`,
      target: user.phone,
    })

    if (!sendingResult.success) {
      throw createHttpError(sendingResult)
    }

    return {
      success: true,
      data: 'Verification code sent successfully'
    }
  }

  @Post('callback')
  async callback(
    @User() user: UserModel,
    @Body('code') code: string
  ) {
    if (!code) {
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, 'Verification code is required')
    }

    if (user.verified) {
      throw createRawHttpError(HttpStatus.CONFLICT, 'User already verified')
    }
    if (!user.verificationToken) {
      throw createRawHttpError(HttpStatus.NOT_FOUND, 'User verification token not found')
    }

    const result = await this.cryptoService.compare(code, user.verificationToken)
    if (!result) {
      throw createRawHttpError(HttpStatus.BAD_REQUEST, 'Invalid verification code')
    }

    // check if the last verification request was less than 5 minutes ago
    if (user.lastVerificationRequest && dateIsExpired(user.lastVerificationRequest, 5 * 60 * 1000)) {
      throw createRawHttpError(HttpStatus.REQUEST_TIMEOUT, 'Verification code expired')
    }

    const updateResult = await this.userService.updateById(user.id, {
      verified: true,
      verificationToken: null,
      lastVerificationRequest: null,
    })

    if (!updateResult.success) {
      throw createHttpError(updateResult, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND
      })
    }

    return {
      success: true,
      data: 'User verified successfully'
    }
  }

}
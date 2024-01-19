import { UserGuard } from "@/adapters/user/guards/user.guard";
import { User } from "@/adapters/user/user.decorator";
import { UserModel } from "@/adapters/user/user.dto";
import { createRawHttpError } from "@/utils/errors";
import { Body, Controller, Get, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { EnableStwtAuth } from "../auth.decorator";
import { VerifyService } from "../services/verify.service";


@UseGuards(
  AuthGuard,
  UserGuard,
)
@EnableStwtAuth()
@Controller('auth/verify')
export class VerifyController {

  constructor(
    private readonly verifyService: VerifyService,
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

    await this.verifyService.sendCode(user)
    return {
      success: true,
      data: 'Message queued for sending'
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
    await this.verifyService.approve2faSession(user, code)
    return {
      success: true,
      data: 'User verified successfully'
    }
  }

}
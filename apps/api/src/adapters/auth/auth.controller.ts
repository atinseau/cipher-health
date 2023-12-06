import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { signinSchema, signupSchema } from './auth.schema';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import { createHttpError, createRawHttpError } from '@/utils/errors';
import { CryptoService } from '@/common/crypto/crypto.service';
import { AuthService } from './auth.service';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserToken } from '../user/user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Get('/health')
  async health() {
    return 'OK'
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() body: any) {

    const output = signupSchema.safeParse(body)

    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.create(omit(output.data, [
      'confirmPassword'
    ]))

    if (!result.success) {
      throw createHttpError(result, {
        DUPLICATE_EMAIL: HttpStatus.CONFLICT,
        UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }

    return {
      success: true,
      data: result.data.id
    }
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() body: any) {
    const output = signinSchema.safeParse(body)

    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.findByEmail(output.data.email)

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
        UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR
      })
    }

    if (!result.data.password) {
      throw createRawHttpError(
        HttpStatus.FORBIDDEN,
        'This account was created with a social login provider. Please use that provider or create a password for this account to sign in.'
      )
    }

    if (!await this.cryptoService.compare(output.data.password, result.data.password)) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid credentials')
    }

    // Ban all previous sessions (soft delete all refresh tokens)
    // Potentially some access tokens could still be valid, but they will be invalid after they expire
    await this.userService.clearPreviousSessions(result.data)
    return await this.authService.createTokens(result.data)
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body('accessToken') accessToken: string,
    @Body('refreshToken') refreshToken?: string
  ) {
    if (!refreshToken) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Please provide a refresh token.')
    }

    const jwtResult = await this.jwtService.verify<UserToken>(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!jwtResult) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token, cannot renew access token.')
    }

    const result = await this.userService.findById(jwtResult.id)
    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
        UNKNOWN_ERROR: HttpStatus.INTERNAL_SERVER_ERROR
      })
    }

    // Check if the refresh token is valid and not deleted
    const userRefreshToken = result.data.refreshTokens.find(token => token.token === refreshToken)
    if (!userRefreshToken || userRefreshToken.deletedAt) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token, cannot renew access token.')
    }

    // result.data.refreshTokens

    // Also ban the current access token (add it to the blacklist)
    const isAdded = await this.jwtService.addToBlacklist(accessToken)

    // Ban all previous sessions (soft delete all refresh tokens)
    const isClear = await this.userService.clearPreviousSessions(result.data)

    if (!isAdded || !isClear) {
      throw createRawHttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Could not renew access token.')
    }

    // Renew the session with new access and refresh tokens
    return await this.authService.createTokens(result.data)
  }
}
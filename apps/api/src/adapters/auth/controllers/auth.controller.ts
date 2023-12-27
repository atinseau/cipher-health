import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { signinSchema, signupSchema } from '../auth.schema';
import { UserService } from '../../user/user.service';
import { omit } from 'lodash';
import { createHttpError, createRawHttpError } from '@/utils/errors';
import { CryptoService } from '@/common/crypto/crypto.service';
import { AuthService } from '../auth.service';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserModel, UserToken } from '../../user/user.dto';
import { UserGuard } from '@/adapters/user/guards/user.guard';
import { User } from '@/adapters/user/user.decorator';
import { AccessToken } from '../auth.decorator';
import { AuthGuard } from '../guards/auth.guard';
// import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { UserType } from '@prisma/client';

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

  /**
   * The "stwt" param is used to differentiate which type of user is signing up (act like an invitation ).
   * is verified with the STWT_SECRET env variable.
   * If the token is not valid, the request is rejected.
   * 
   * if stwt is not provided, the user will always be created as a CLIENT.
   */
  @Post('signup')
  @HttpCode(201)
  async signup(
    @Body() body: any,
    @Query('stwt') stwt?: string // Signup Token With Type (stwt)
  ) {
    const output = signupSchema.safeParse(body)

    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    let type: UserType = 'CLIENT'
    if (stwt) {
      const stwtResult = await this.authService.verifyStwt(stwt)
      if (!stwtResult.success) {
        throw createHttpError(stwtResult, {
          INVALID_SIGNUP_TOKEN: HttpStatus.UNAUTHORIZED,
        })
      }
      type = stwtResult.data.type
    }

    const result = await this.userService.create({
      ...omit(output.data, [
        'confirmPassword'
      ]),
      type,
    })

    if (!result.success) {
      throw createHttpError(result, {
        DUPLICATE_EMAIL: HttpStatus.CONFLICT,
      })
    }

    // After the user is created, we can safely delete the stwt
    // because it's no longer needed
    // it's a soft delete, it will be deleted from the database after 24 hours + 1 hour
    if (stwt) {
      await this.authService.deleteStwt(stwt, result.data.id)
    }

    return {
      success: true,
      data: {
        id: result.data.id,
      }
    }
  }

  @Get('signup/info')
  async signupProcessInfo(@Query('stwt') stwt: string) {
    // TODO: check where the signup process is
    // If the user is already created, verified and completed 
    // the signup info, return an error
    // in other cases, return the signup process info
  }



  @Post('signin')
  @HttpCode(200)
  async signin(
    @Body() body: any,
    @Query('type') type: UserType = 'CLIENT'
  ) {
    const output = signinSchema.safeParse(body)

    if (!output.success)
      throw createRawHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.findByEmail(output.data.email)

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
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

    // if the user is not of the type requested, reject the request
    if (result.data.type !== type) {
      // it's a bit misleading, but it's for security reasons
      // we don't want to tell the user that the email exists in the database
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid credentials')
    }

    // Ban all previous sessions (soft delete all refresh tokens)
    // Potentially some access tokens could still be valid, but they will be invalid after they expire
    await this.userService.clearPreviousSessions(result.data)

    return {
      success: true,
      data: await this.authService.createTokens(result.data)
    }
  }

  @Get('signout')
  @UseGuards(AuthGuard, UserGuard)
  async signout(
    @User() user: UserModel,
    @AccessToken() accessToken: string
  ) {
    const logoutResult = await this.authService.logout(user, accessToken)
    if (!logoutResult.success) {
      throw createRawHttpError(HttpStatus.INTERNAL_SERVER_ERROR, logoutResult)
    }

    return {
      success: true,
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body('accessToken') accessToken: string, // in the body because it's unauthenticated request
    @Body('refreshToken') refreshToken?: string // in the body because it's unauthenticated request
  ) {

    // TODO: add check for accessToken is defined

    if (!refreshToken) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Please provide a refresh token.')
    }

    const jwtResult = await this.jwtService.verify<UserToken>(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!jwtResult) {
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token, cannot renew access token.')
    }

    const result = await this.userService.findById(jwtResult.id, {
      refreshTokens: {
        where: {
          deletedAt: null
        }
      }
    })

    if (!result.success) {
      throw createHttpError(result, {
        USER_NOT_FOUND: HttpStatus.NOT_FOUND,
      })
    }

    // Check if the refresh token is valid and not deleted
    const userRefreshToken = result.data.refreshTokens.find(token => token.token === refreshToken)

    if (!userRefreshToken || userRefreshToken.deletedAt) {
      // TODO: there is an issue here
      console.log(result.data.refreshTokens, userRefreshToken)
      throw createRawHttpError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token, cannot renew access token.')
    }

    // Ban all previous sessions (soft delete all refresh tokens, and add access token to blacklist)
    const logoutResult = await this.authService.logout(result.data, accessToken)

    // The most common reason for this failure is that the access token is not provided in the request body
    // or redis is not running and the access token cannot be added to the blacklist
    // so the resulting behavior is:
    // - no new access token and refresh token are returned to the client
    // - and only the access token will be valid until it expires
    if (!logoutResult.success) {
      throw createRawHttpError(HttpStatus.INTERNAL_SERVER_ERROR, logoutResult)
    }

    // Renew the session with new access and refresh tokens
    return {
      success: true,
      data: await this.authService.createTokens(result.data)
    }
  }
}
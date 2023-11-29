import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { signinSchema, signupSchema } from './auth.schema';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import { createHttpError } from '@/utils/errors';
import { CryptoService } from '@/common/crypto/crypto.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly authService: AuthService,
  ) { }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() body: any) {

    const output = signupSchema.safeParse(body)

    if (!output.success)
      throw createHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.create(omit(output.data, [
      'confirmPassword'
    ]))

    if (!result.success) {
      if (
        typeof result.error !== 'string'
        && result.error.type === 'DUPLICATE_EMAIL'
      ) throw createHttpError(HttpStatus.CONFLICT, result.error.message)
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, result.error)
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
      throw createHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.findByEmail(output.data.email)

    if (!result.success) {
      if (typeof result.error !== 'string' && result.error.type === 'USER_NOT_FOUND')
        throw createHttpError(HttpStatus.NOT_FOUND, result.error.message)
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, result.error)
    }

    if (!result.data.password) {
      throw createHttpError(
        HttpStatus.FORBIDDEN,
        'This account was created with a social login provider. Please use that provider or create a password for this account to sign in.'
      )
    }

    if (!await this.cryptoService.compare(output.data.password, result.data.password)) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, 'Invalid credentials')
    }

    return await this.authService.createTokens(result.data)
  }
}
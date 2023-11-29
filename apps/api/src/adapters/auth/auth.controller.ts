import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { signinSchema } from './auth.schema';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import { createHttpError } from '@/utils/errors';
import { CryptoService } from '@/common/crypto/crypto.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService
  ) { }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() body: any) {

    const output = signinSchema.safeParse(body)

    if (!output.success)
      throw createHttpError(HttpStatus.UNPROCESSABLE_ENTITY, output.error.errors)

    const result = await this.userService.create(omit(output.data, ['confirmPassword']))
    if (!result.success) {
      const { type } = result.error
      if (type === 'DUPLICATE_EMAIL')
        throw createHttpError(HttpStatus.CONFLICT, result.error.message)
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, result.error)
    }

    return {
      success: true,
      data: result.data.id
    }
  }
}
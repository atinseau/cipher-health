import { UserService } from "@/adapters/user/services/user.service";
import { CryptoService } from "@/common/crypto/crypto.service";
import { JwtService } from "@/common/jwt/jwt.service";
import { PhoneService } from "@/common/phone/phone.service";
import { RandomService } from "@/common/random/random.service";
import { SigninResult, UserModel } from "@/types";
import { createHttpError, createRawHttpError } from "@/utils/errors";
import { dateIsExpired } from "@cipher-health/utils";
import { HttpStatus, Injectable } from "@nestjs/common";



@Injectable()
export class VerifyService {

  constructor(
    private readonly randomService: RandomService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly phoneService: PhoneService,
  ) { }

  async createCode() {
    const code = this.randomService.createNumeric(6)
    const hashedCode = await this.cryptoService.hash(code)

    return {
      code,
      hashedCode
    }
  }


  // Wait for user update but don't wait for the code to be sent
  async sendCode(user: UserModel) {
    const { code, hashedCode } = await this.createCode()
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
    // don't wait for the code to be sent
    this.phoneService.send({
      body: `Your verification code is ${code}`,
      target: user.phone,
    })
  }

  async create2faSession(user: UserModel): Promise<SigninResult> {
    await this.sendCode(user)
    const token = await this.jwtService.sign({ id: user.id }, process.env.TWO_FACTOR_SECRET, {
      expiresIn: '5m'
    })
    return {
      type: '2fa',
      token
    }
  }

  // This function is used in verify.controller.ts and in auth.controller.ts
  // after the code has validated, we need to update the user by 
  // removing the verification token, but for verify.controller.ts usage
  // we also need to set the verified flag to true (because the user is not)
  async approve2faSession(user: UserModel, code: string) {
    if (!user.verificationToken) {
      throw createRawHttpError(HttpStatus.NOT_FOUND, 'User verification token not found')
    }

    const result = await this.cryptoService.compare(code, user.verificationToken)
    if (!result) {
      throw createRawHttpError(HttpStatus.BAD_REQUEST, 'Invalid verification code')
    }

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
  }

}
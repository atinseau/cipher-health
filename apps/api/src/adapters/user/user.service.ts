import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { UserCreate } from "./user.dto";
import { SafeResult } from "@/types";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CryptoService } from "@/common/crypto/crypto.service";

@Injectable()
export class UserService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly loggerService: Logger
  ) { }

  async create(user: UserCreate): Promise<SafeResult<User>> {
    try {
      const result = await this.prismaService.user.create({
        data: {
          ...user,
          // Password will always be defined here because of the schema
          password: await this.cryptoService.hash(user.password!)
        }
      })
      return {
        success: true,
        data: result
      }
    } catch (e) {

      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        return {
          success: false,
          error: {
            type: 'DUPLICATE_EMAIL',
            message: 'Email already exists'
          }
        }
      }

      this.loggerService.error(e)
      return {
        success: false,
        error: e.message
      }
    }
  }

}
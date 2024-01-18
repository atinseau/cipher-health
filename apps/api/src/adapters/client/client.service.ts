import { Injectable } from "@nestjs/common";
import { ProfileCreate, UserModel } from "../user/user.dto";
import { ClientCreate } from "./client.dto";
import { UserService } from "../user/services/user.service";
import { PrismaService } from "@/common/database/prisma.service";
import { createResult } from "@/utils/errors";
import { Logger } from "@/common/logger/logger.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



@Injectable()
export class ClientService {

  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly loggerService: Logger,
  ) { }


  private async createStandaloneClient(userId: string, clientCreation?: Partial<ClientCreate>) {
    try {
      const admin = await this.prismaService.client.create({
        data: {
          userId,
          ...clientCreation
        }
      })
      return createResult(admin)
    } catch (e) {
      this.loggerService.error(e, 'ClientService')
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
        return createResult(null, false, {
          type: 'USER_NOT_FOUND',
          message: 'User not found'
        })
      }
      return createResult(null, false, e.message as string)
    }
  }


  async createClient(clientCreation: {
    user: UserModel,
    profile: ProfileCreate,
    client: Partial<ClientCreate>
  }) {

    const { client, profile, user } = clientCreation

    const profileResultPromise = this.userService.createProfile(user.id, profile)
    const clientResultPromise = this.createStandaloneClient(user.id, client)

    const [profileResult, clientResult] = await Promise.all([profileResultPromise, clientResultPromise])

    if (!clientResult.success) {
      return clientResult
    }
    if (!profileResult.success) {
      return profileResult
    }

    user.profile = profileResult.data
    user.client = clientResult.data

    await this.userService.updateById(user.id, {
      completed: true
    })
    return createResult(user)
  }

}
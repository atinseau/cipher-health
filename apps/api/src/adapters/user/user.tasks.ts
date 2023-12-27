import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";



@Injectable()
export class UserTasks {

  constructor(
    private readonly loggerService: Logger,
    private readonly prismaService: PrismaService,
  ) { }

  /**
   * The purpose of this task is to remove all expired refresh tokens from the database
   * in order to keep the database clean and to avoid having a huge table
   * 
   * it will remove also the active refresh tokens that are expired (not soft-deleted yet)
   * 
   * !!! WE SHOULD NOT REMOVE THE SOFT-DELETED REFRESH TOKENS !!!
   * because we need to keep them in order to be able to check if a refresh token is valid or not
   * (if it's not soft-deleted, it means it's still valid, could be not expired yet)
   * 
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteExpiredRefreshTokens() {
    try {
      const result = await this.prismaService.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lte: new Date()
          }
        }
      })
      this.loggerService.log(`Refresh tokens purged: ${result.count}`, 'UserTasksService')
    } catch (e) {
      this.loggerService.error(e, 'UserTasksService')
    }
  }


}
import { PrismaService } from "@/common/database/prisma.service";
import { Logger } from "@/common/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class AuthTasks {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: Logger,
  ) { }

  /**
   * Cleanup expired refresh tokens every week
   */
  @Cron(CronExpression.EVERY_WEEK)
  async cleanupStwt() {
    try {
      const r = await this.prismaService.stwt.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
      this.loggerService.log(`Deleted ${r.count} expired STWTs`, 'AuthTasks')
    } catch (e) {
      this.loggerService.error(e, 'AuthTasks')
    }
  }

}
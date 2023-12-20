import { APP_GUARD, NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { API_PREFIX } from '@/utils/constants';
import { AuthModule } from './adapters/auth/auth.module';
import { UserModule } from './adapters/user/user.module';
import { PrismaModule } from './common/database/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { ClientModule } from './adapters/client/client.module';
import { RedisModule } from './common/redis/redis.module';
import { PhoneModule } from './common/phone/phone.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import helmet from 'helmet';
import { ThrottlerExceptionFilter } from './common/throttler/throttler-exception.filter';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    PhoneModule,
    RedisModule,
    LoggerModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ClientModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule { }


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);
  app.use(helmet());
  app.enableCors();

  app.useGlobalFilters(new ThrottlerExceptionFilter())

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

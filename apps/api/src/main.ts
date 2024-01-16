import { NestFactory } from '@nestjs/core';
import { Controller, Get, Module } from '@nestjs/common';
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
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import helmet from 'helmet';
import { ThrottlerExceptionFilter } from './common/throttler/throttler-exception.filter';
import { MailModule } from './common/mail/mail.module';
import { AdminModule } from './adapters/admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GlobalModule } from './adapters/global/global.module';

@Module({
  imports: [
    // TODO: configure throttler on all routes
    // ThrottlerModule.forRoot([{
    //   ttl: 60000,
    //   limit: 100,
    // }]),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    PhoneModule,
    MailModule,
    RedisModule,
    LoggerModule,
    UserModule,
    AuthModule,
    AdminModule,
    ClientModule,
    GlobalModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ThrottlerGuard
  //   }
  // ]
})
export class AppModule { }


async function bootstrap() {

  if (!process.env.PORT) {
    throw new Error('PORT env variable is not defined');
  }

  const app = await NestFactory.create(AppModule);

  app.getHttpServer()

  app.setGlobalPrefix(API_PREFIX, {
    exclude: [
      '/'
    ]
  });
  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new ThrottlerExceptionFilter())
  await app.listen(process.env.PORT);
}
bootstrap();

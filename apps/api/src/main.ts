import { NestFactory } from '@nestjs/core';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PhoneModule,
    RedisModule,
    LoggerModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ClientModule,
  ],
})
export class AppModule { }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX)
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

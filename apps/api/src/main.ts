import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { API_PREFIX } from '@/utils/constants';
import { AuthModule } from './adapters/auth/auth.module';
import { UserModule } from './adapters/user/user.module';
import { PrismaModule } from './common/database/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { ProfileModule } from './adapters/profile/profile.module';
import { RedisModule } from './common/redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RedisModule,
    LoggerModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule { }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_PREFIX)

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

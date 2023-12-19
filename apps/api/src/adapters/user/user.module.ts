import { Module, Global, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { UserController } from './controllers/user.controller';
import { UserEncryptionController } from './controllers/user-encryption.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UserMiddleware } from './middleware/user.middleware';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserVerifiedMiddleware } from './middleware/user-verified.middleware';
import { UserProfileMiddleware } from './middleware/user-profile.middleware';

@Global()
@Module({
  providers: [
    UserService,
    JwtService,
    CryptoService,
  ],
  exports: [UserService],
  controllers: [
    UserController,
    UserEncryptionController
  ]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    const BASE_MIDDLEWARE = [
      AuthMiddleware, // check if there is a valid token
      UserMiddleware, // fetch the user from the database
      UserVerifiedMiddleware, // check if the user is verified
    ]

    consumer
      .apply(...BASE_MIDDLEWARE)
      .forRoutes(
        { path: '/user/encryption/profile/create', method: RequestMethod.POST },
      );

    consumer
      .apply(
        ...BASE_MIDDLEWARE,
        UserProfileMiddleware, // check if the user has a profile and fetch it
      )
      .forRoutes(
        { path: '/user/me', method: RequestMethod.GET },
        { path: '/user/profile/create', method: RequestMethod.POST },
      )
  }
}
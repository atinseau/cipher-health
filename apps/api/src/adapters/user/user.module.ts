import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { UserController } from './controllers/user.controller';
import { UserEncryptionController } from './controllers/user-encryption.controller';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserTasks } from './user.tasks';
import { UserEvents } from './user.events';

@Global()
@Module({
  providers: [
    UserEvents,
    UserService,
    UserTasks,
    JwtService,
    CryptoService,
  ],
  exports: [UserService],
  controllers: [
    UserController,
    UserEncryptionController
  ]
})
export class UserModule {}
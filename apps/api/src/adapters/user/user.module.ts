import { Module, Global } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CryptoService } from '@/common/crypto/crypto.service';
import { UserController } from './controllers/user.controller';
import { UserEncryptionController } from './controllers/user-encryption.controller';
import { JwtService } from '@/common/jwt/jwt.service';
import { UserTasks } from './user.tasks';
import { UserEvents } from './user.events';
import { AuthService } from '../auth/services/auth.service';
import { AdminService } from '../admin/admin.service';
import { ProfileService } from './services/profile.service';
import { ClientService } from '../client/client.service';

@Global()
@Module({
  providers: [
    AuthService, // For AuthGuard
    UserEvents,
    ClientService,
    AdminService,
    UserService,
    ProfileService,
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
export class UserModule { }
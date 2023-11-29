import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { CryptoService } from '@/common/crypto/crypto.service';

@Global()
@Module({
  providers: [
    UserService,
    CryptoService,
  ],
  exports: [UserService],
})
export class UserModule {}
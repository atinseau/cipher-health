import { Module, Global } from '@nestjs/common';
import { PhoneService } from './phone.service';

@Global()
@Module({
  providers: [PhoneService],
  exports: [PhoneService],
})
export class PhoneModule { }
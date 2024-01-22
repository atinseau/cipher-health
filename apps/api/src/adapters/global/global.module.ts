import { Module } from "@nestjs/common";
import { GlobalController } from "./global.controller";
// import { MailService } from "@/common/mail/mail.service";


@Module({
  // providers: [
  //   MailService,
  // ],
  controllers: [
    GlobalController
  ]
})
export class GlobalModule {}
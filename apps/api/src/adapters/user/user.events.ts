import { Logger } from "@/common/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";


@Injectable()
export class UserEvents {

  constructor(
    private readonly loggerService: Logger,
  ) { }

  @OnEvent('user.created')
  handleUserCreatedEvent(payload: any) {
    this.loggerService.log('User created event received', 'UserEvents')
  }

}
import { Injectable } from "@nestjs/common";
import twilio from 'twilio'
import { OnModuleInit } from "@nestjs/common";
import { createResult } from "@/utils/errors";
import { Logger } from "../logger/logger.service";


@Injectable()
export class PhoneService implements OnModuleInit {

  private client: twilio.Twilio

  constructor(
    private readonly loggerService: Logger
  ) {}

  onModuleInit() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
      {
        autoRetry: true,
        maxRetries: 3,
      }
    )
  }

  // TODO: support international phone numbers
  private formatPhone(phone: string) {
    return phone
  }

  createMessage(payload: { target: string, body: string }) {
    return {
      send: async () => {
        try {
          const res = await this.client.messages.create({
            from: '+12058943557',
            to: this.formatPhone(payload.target),
            body: payload.body,
          })
          return createResult(res)
        } catch (e) {
          this.loggerService.error(e)
          return createResult(null, false, 'Unable to send message')
        }
      }
    }
  }

  async send(payload: { target: string, body: string }) {
    return await this.createMessage(payload).send()
  }

}
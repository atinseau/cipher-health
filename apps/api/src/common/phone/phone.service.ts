import { Injectable } from "@nestjs/common";
import twilio from 'twilio'
import { OnModuleInit } from "@nestjs/common";
import { createResult } from "@/utils/errors";
import { Logger } from "../logger/logger.service";

import { default as phoneFormatter } from 'phone'


@Injectable()
export class PhoneService implements OnModuleInit {

  private client: twilio.Twilio

  constructor(
    private readonly loggerService: Logger
  ) { }

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
  public formatPhone(phone: string, country = 'FR') {

    const formatted = phoneFormatter(phone, {
      country
    })

    return formatted.isValid
      ? formatted.phoneNumber
      : null
  }

  createMessage(payload: { target: string, body: string }) {
    return {
      send: async () => {
        try {

          const formatted = this.formatPhone(payload.target)

          if (!formatted) return createResult(null, false, {
            type: 'PHONE_FORMAT_ERROR',
            message: 'Invalid phone number'
          })

          const res = await this.client.messages.create({
            from: '+16592242346',
            to: formatted,
            body: payload.body,
          })
          return createResult(res)
        } catch (e) {
          this.loggerService.error(e, 'PhoneService')
          return createResult(null, false, 'Unable to send message')
        }
      }
    }
  }

  async send(payload: { target: string, body: string }) {
    return await this.createMessage(payload).send()
  }

}
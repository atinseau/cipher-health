import { Injectable, OnModuleInit } from "@nestjs/common";
import { Transporter, createTransport } from 'nodemailer'
import Mail from "nodemailer/lib/mailer";
import { render } from '@react-email/render'

import * as templates from './templates'

@Injectable()
export class MailService implements OnModuleInit {

  private transporter: Transporter

  onModuleInit() {
    this.transporter = createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })
  }

  async send(options: Mail.Options) {
    return this.transporter.sendMail(options)
  }

  async render<T extends keyof typeof templates>(template: T, props?: Parameters<typeof templates[T]>[0]) {
    const fn = templates[template]
    return render(fn(props as any))
  }

}
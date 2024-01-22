import { Injectable, OnModuleInit } from "@nestjs/common";
import { Transporter, createTransport } from 'nodemailer'
import Mail from "nodemailer/lib/mailer";
import renderWithContext from "./utils/renderWithContext";
import { render as renderEmail } from "@react-email/render";
import { IEmailContext } from "./contexts/EmailProvider";

@Injectable()
export class MailService implements OnModuleInit {

  private transporter: Transporter

  onModuleInit() {

    global.React = require('react')

    this.transporter = createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      from: process.env.MAIL_USER,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  async send<T extends ((...args: any[]) => JSX.Element) | React.FC | false = false>(
    options:
      & Mail.Options
      & (
        T extends ((...args: any[]) => JSX.Element) | React.FC
        ? { component: T, componentProps: React.ComponentProps<T> }
        : {}
      )
  ) {

    const html = 'component' in options
      ? await this.render({
        component: options.component,
        componentProps: options.componentProps,
        ctx: {
          sender: process.env.MAIL_USER,
          receiver: options.to as string
        }
      })
      : options.html

    return this.transporter.sendMail({
      ...options,
      html
    })
  }

  async render<T extends ((...args: any[]) => JSX.Element) | React.FC>(options: {
    component: T,
    componentProps: React.ComponentProps<T>,
    ctx: IEmailContext
  }) {
    const reactTree = renderWithContext(options)
    return renderEmail(reactTree)
  }

}
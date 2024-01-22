// import { MailService } from "@/common/mail/mail.service";
import { Controller, Get, Ip } from "@nestjs/common";


@Controller()
export class GlobalController {

  // constructor(
  //   private readonly mailService: MailService
  // ) {}

  @Get()
  index(@Ip() ip: string) {
    return {
      message: 'Welcome to the API',
      ip
    }
  }

  // @Get('test-mail')
  // async testMail() {

  //   await this.mailService.send({
  //     to: 'arthurtinseau@live.fr',
  //     subject: '[Hygiie] Bonjour j ai un message pour toi',
  //     from: 'Hygiie <' + process.env.MAIL_USER + '>',
  //     text: 'Votre message de connexion',
  //     html: '<p>Votre message de connexion</p>'
  //   })

  //   return 'ok'

  // }

}
import { MailService } from "./mail.service"


describe('MailService', () => {

  let mailService: MailService

  beforeAll(() => {
    mailService = new MailService()
  })

  it('should render mail', async () => {
    const html = await mailService.render('CreatedUserEmail')
    expect(html).toBeDefined()
    expect(typeof html).toBe('string')
  })
})
import { useEmailContext } from "./contexts/EmailProvider"
import { MailService } from "./mail.service"

const FakeMail: React.FC<{ name: string }> = () => {
  return <p>Salut tout le monde</p>
}

const FakeMailWithContext: React.FC<{ age: number }> = ({ age }) => {
  const { sender } = useEmailContext()
  return <p>Salut {sender}, j'ai {age} ans</p>
}

describe('MailService', () => {

  let mailService: MailService

  beforeAll(() => {
    mailService = new MailService()
  })

  it('should render mail', async () => {
    const html = await mailService.render({
      component: FakeMail,
      componentProps: { name: 'John' },
      ctx: {}
    })

    expect(html).toBeDefined()
    expect(html).toContain('<p>Salut tout le monde</p>')
  })

  it('should be able to consume the context in the template', async () => {
    const html = await mailService.render({
      component: FakeMailWithContext,
      componentProps: { age: 18 },
      ctx: { sender: 'John' }
    })

    expect(html).toBeDefined()
    // &#x27; is the HTML entity for the single quote
    expect(html).toContain('<p>Salut John, j&#x27;ai 18 ans</p>')
  })
})
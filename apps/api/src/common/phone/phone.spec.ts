import { Logger } from "../logger/logger.service"
import { PhoneService } from "./phone.service"



describe('PhoneService', () => {

  let phoneService: PhoneService

  beforeAll(() => {
    phoneService = new PhoneService(new Logger())
  })

  it('should be defined', () => {
    expect(phoneService).toBeDefined()
  })

  it('should format phone numbers (FR)', () => {
    const phone1 = '0606060606'
    const formatted1 = phoneService['formatPhone'](phone1, 'FR')
    expect(formatted1).not.toBeNull()
    expect(formatted1).toBe('+33606060606')

    const phone2 = '06 06 06 06 06'
    const formatted2 = phoneService['formatPhone'](phone2, 'FR')
    expect(formatted2).not.toBeNull()
    expect(formatted2).toBe('+33606060606')

    const phone3 = '06-06-06-06-06'
    const formatted3 = phoneService['formatPhone'](phone3, 'FR')
    expect(formatted3).not.toBeNull()
    expect(formatted3).toBe('+33606060606')
  })

  // TODO: support international phone numbers

})
import { RandomService } from "./random.service"


describe('RandomService', () => {

  let randomService: RandomService

  beforeAll(async () => {
    randomService = new RandomService()
  })

  it('generate a random numeric string', async () => {
    const numericString = randomService.createNumeric(6)
    expect(numericString).toBeDefined()
    expect(numericString.length).toBe(6)
    expect(numericString).toMatch(/^[0-9]+$/)
  })

  it ('generate a random numeric string with 10 digits', async () => {
    const numericString = randomService.createNumeric(10)
    expect(numericString).toBeDefined()
    expect(numericString.length).toBe(10)
    expect(numericString).toMatch(/^[0-9]+$/)
  })

  it('generate multiple random numeric strings and check they are different', async () => {
    const numericString1 = randomService.createNumeric(6)
    const numericString2 = randomService.createNumeric(6)
    expect(numericString1).not.toBe(numericString2)
  })

})
import { getMinimalMajorBirthDate } from "../src/getMinimalMajorBirthDate"

describe('getMinimalMajorBirthDate', () => {
  it('should return a date', () => {

    const minimalDate = getMinimalMajorBirthDate()

    const date1 = new Date()
    const date2 = new Date()

    date1.setFullYear(date1.getFullYear() - 19)
    date2.setFullYear(date2.getFullYear() - 0)

    expect(minimalDate).toBeInstanceOf(Date)

    const diff1 = (date1.getTime() - minimalDate.getTime()) / (1000 * 60 * 60 * 24)
    const diff2 = (date2.getTime() - minimalDate.getTime()) / (1000 * 60 * 60 * 24)

    expect(diff1).toBeLessThanOrEqual(0) // is major
    expect(diff2).toBeGreaterThan(0) // is minor
  })
}) 
import { containLowerCaseLetters } from "../src/containLowerCaseLetters"
import { containUpperCaseLetters } from "../src/containUpperCaseLetters"
import { containNumbers } from "../src/containNumbers"
import { containSpecialChar } from "../src/containSpecialChar"
import { socialSecurityRegex } from "../src"



describe('Regex', () => {

  it("Should contain numbers in string", () => {

    const a = "abcdef"
    const b = "123456"
    const c = "abc123"

    expect(containNumbers(a)).toBe(false)
    expect(containNumbers(b)).toBe(true)
    expect(containNumbers(c)).toBe(true)
  })

  it('Should contain lowercase letters in string', () => {

    const a = "12981982"
    const b = "abcdef"
    const c = "abc123"
    const d = "ABC123"

    expect(containLowerCaseLetters(a)).toBe(false)
    expect(containLowerCaseLetters(b)).toBe(true)
    expect(containLowerCaseLetters(c)).toBe(true)
    expect(containLowerCaseLetters(d)).toBe(false)

  })

  it('Should contain uppercase letters in string', () => {

    const a = "12981982"
    const b = "abcdef"
    const c = "abc123"
    const d = "ABC123"
    const e = "Abc123"
    const f = "ALSKDLSKD"

    expect(containUpperCaseLetters(a)).toBe(false)
    expect(containUpperCaseLetters(b)).toBe(false)
    expect(containUpperCaseLetters(c)).toBe(false)
    expect(containUpperCaseLetters(d)).toBe(true)
    expect(containUpperCaseLetters(e)).toBe(true)
    expect(containUpperCaseLetters(f)).toBe(true)
  })

  it('Should contain special characters in string', () => {

    const a = "12981982"
    const b = "abcdef"
    const c = "abc123"
    const d = "ABC123"
    const e = "Abc123"
    const f = "AL-SKDLSKD"
    const g = "#?.!@$%^&*-"

    expect(containSpecialChar(a)).toBe(false)
    expect(containSpecialChar(b)).toBe(false)
    expect(containSpecialChar(c)).toBe(false)
    expect(containSpecialChar(d)).toBe(false)
    expect(containSpecialChar(e)).toBe(false)
    expect(containSpecialChar(f)).toBe(true)
    expect(containSpecialChar(g)).toBe(true)

  })

  it('Should be a valid social security number', () => {
    expect(socialSecurityRegex.test('sdkqlsdkqsd')).toBe(false)
    expect(socialSecurityRegex.test('101112B01826607')).toBe(true)
    expect(socialSecurityRegex.test('201112A01826607')).toBe(true)
    expect(socialSecurityRegex.test('185057800608436')).toBe(true)
    expect(socialSecurityRegex.test('187082A32132111')).toBe(true)
    expect(socialSecurityRegex.test('qsdqsd101114101826607qsdqsdq')).toBe(false)
    expect(socialSecurityRegex.test('')).toBe(false)
  })

})
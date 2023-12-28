import { signupSchema } from "./auth.schema"

function testPassword(password: string) {
  try {
    signupSchema.parse({
      email: 'john@doe.fr',
      password: password,
      confirmPassword: password,
      phone: '0606060606',
      country: 'FR',
    })
    return true
  } catch (e) {
    return false
  }
}

describe('Auth', () => {

  it('should be a strong password', () => {

    expect(testPassword('AB1-efg')).toBeFalsy() // wrong length with all requirement, min 8
    expect(testPassword('Ab1-efgh')).toBeTruthy() // should be ok because 8 is the min length

    // Test other requirements
    expect(testPassword('Ab--efgh')).toBeFalsy() // no number
    expect(testPassword('Ab1-efgh')).toBeTruthy() // with number (already checked)
    expect(testPassword('ab1-efgh')).toBeFalsy() // no uppercase
    expect(testPassword('Ab1-efgh')).toBeTruthy() // with uppercase  (already checked)
    expect(testPassword('AB1-EFGH')).toBeFalsy() // no lowercase
    expect(testPassword('Ab1eefgh')).toBeFalsy() // with no special character  (already checked)
    expect(testPassword('Ab1-efgh')).toBeTruthy() // with special character
  
  
    // Real life test
    expect(testPassword('06112001..Arttsn')).toBeTruthy()
  })

})
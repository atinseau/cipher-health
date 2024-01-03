

export const regexContainUpperCaseLetters = /(?=.*[A-Z])/;

export function containUpperCaseLetters(value: string) {
  return regexContainUpperCaseLetters.test(value)
}
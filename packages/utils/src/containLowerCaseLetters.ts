

export const regexContainLowerCaseLetters = /(?=.*[a-z])/;

export function containLowerCaseLetters(value: string) {
  return regexContainLowerCaseLetters.test(value)
}
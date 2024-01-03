

export const regexContainSpecialChar = /(?=.*?[#?.!@$%^&*-])/;

export function containSpecialChar(value: string) {
  return regexContainSpecialChar.test(value)
}
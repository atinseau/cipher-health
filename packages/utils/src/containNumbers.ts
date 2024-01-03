// regex to check presence of number

export const regexContainNumbers = /(?=.*[0-9])/;

export function containNumbers(value: string) {
  return regexContainNumbers.test(value)
}
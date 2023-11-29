import { HttpException, HttpStatus } from "@nestjs/common";

export const createHttpError = (status: HttpStatus, error: any) => {
  throw new HttpException({
    success: false,
    errors: error
  }, status)
}

export function createResult<
  Data,
  IsSuccess extends boolean = true,
  TypeKey extends string = string,
  Error extends { type: TypeKey, message: string} | string = string
>(
  data: Data,
  success: IsSuccess = true as IsSuccess,
  error?: Error
): IsSuccess extends true
  ? { success: IsSuccess, data: Data }
  : { success: IsSuccess, error: Error } {

  if (!success) {
    return { success, error } as any
  }
  return { success, data } as any
}
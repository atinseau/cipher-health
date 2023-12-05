import { HttpException, HttpStatus } from "@nestjs/common";

type SuccessResult<TData> = {
  success: true,
  data: TData
}

type ErrorResult<TError extends { type: string, message: string } | string = string> = {
  success: false,
  error: TError extends string
  ? {
    type: 'UNKNOWN_ERROR',
    message: TError
  }
  : {
    type: TError extends { type: infer TErrorKey } ? TErrorKey : 'UNKNOWN_ERROR',
    message: TError extends { message: infer TErrorMessage } ? TErrorMessage : any
  }
}

export function createResult<
  TData,
  TSuccess extends boolean = true,
  TErrorKey extends string = string,
  TError extends { type: TErrorKey, message: string } | string = string,
>(
  data: TData,
  success: TSuccess = true as TSuccess,
  error?: TError
): TSuccess extends true
  ? SuccessResult<TData>
  : ErrorResult<TError> {

  if (error) {
    return {
      success: false,
      error: {
        type: typeof error === 'string' ? 'UNKNOWN_ERROR' : error.type,
        message: typeof error === 'string' ? error : error.message
      }
    } as any
  }

  return {
    success,
    data
  } as any
}


export const createRawHttpError = (status: HttpStatus, message: any) => {
  return new HttpException(message, status)
}

export const createHttpError = <
  TErrorKey extends string = string,
  T extends ErrorResult<
    | { type: TErrorKey, message: string }
    | string // This is for UNKNOWN_ERROR which is ported by "ErrorResult<string>" in type key
  > = ErrorResult<{ type: TErrorKey, message: string } | string>
>(
  result: T,
  errorMap: Record<T['error']['type'] | 'UNKNOWN_ERROR', HttpStatus>
) => {
  // TODO: use logger with correlation id here
  if (result.success) {
    console.error('createHttpError called with a success result')
    return
  }

  const status = errorMap[result.error.type] || errorMap.UNKNOWN_ERROR
  return createRawHttpError(status, result.error.message)
}
import { HttpException, HttpStatus } from "@nestjs/common";

export const createHttpError = (status: HttpStatus, error: any) => {
  throw new HttpException({
    success: false,
    errors: error
  }, status)
}

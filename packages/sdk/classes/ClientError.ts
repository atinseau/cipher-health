

type ClientErrorOptions = {
  status: number
  data: any
}

export class ClientError extends Error {

  public status: number

  constructor(options: ClientErrorOptions) {
    const error = options?.data?.error || options?.data?.errors || options?.data
    let message = error

    // MALFORMED_REQUEST, ZOD_ERROR
    if (Array.isArray(error) && options.status === 422) {
      message = error[0].message
    }
    super(message)

    this.status = options.status
  }
}
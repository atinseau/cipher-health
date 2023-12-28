

type ClientErrorOptions = {
  status: number
  error?: Error
  data: any
}

export class ClientError extends Error {

  public status: number
  public data: any

  constructor(options: ClientErrorOptions) {
    const error = options?.error?.message || options?.data?.error || options?.data?.errors || options?.data || 'Unknown error'
    let message = error

    super(typeof message !== 'string' ? JSON.stringify(message) : message)

    this.status = options.status
    this.data = error
  }
}
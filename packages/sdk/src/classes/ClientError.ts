

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

    if (typeof message === 'object') {
      message = message?.message || JSON.stringify(message)
    }

    super(message)

    this.status = options.status
    this.data = error
  }
}
import { HOST } from '../constants'
import { ClientError } from './ClientError'

import { Mutex } from 'async-mutex'

type Query = Record<string, string | number>

type RequestOptions = {
  ttl?: number // time to live of the req cache
  skipHooks?: HookType[]
  skipRetry?: boolean
  maxRetry?: number
}

type RequestOrder<T extends 'GET' | 'POST'> = {
  query?: Query
}
  & RequestOptions
  & (
    T extends 'POST'
    ? { body?: Record<string, any> }
    : {}
  )

type HookType = 'afterRequest' | 'beforeRequest'

type AfterRequestHook = (
  res: Response,
  controller: {
    retry: () => Promise<void>
    retryCount: number
  }
) => Promise<void>

type BeforeRequestHook = (
  init: RequestInit & { options: RequestOptions }
) => Promise<void>

type HookCallback<T extends HookType> = T extends 'afterRequest'
  ? AfterRequestHook
  : BeforeRequestHook

type RequestContext = Record<string, {
  mutex: Mutex,
  output: any
}>

export type ClientOptions = {
  threadSafe?: boolean
  baseUrl?: string
  maxRetry?: number
}

export class Client {

  private customHeaders: Record<string, string> = {}
  private hooks: { [key in HookType]: HookCallback<key> } = {} as any
  private cache: Record<string, { output: any, timestamp: number }> = {}
  private requestContext: RequestContext = {}
  private options: ClientOptions = {}

  constructor(options?: ClientOptions) {

    const baseUrl = options?.baseUrl || HOST
    const suffix = '/api/v1'

    this.options = {
      threadSafe: false,
      maxRetry: 3,
      ...options || {},
      baseUrl: baseUrl.endsWith('/') ? baseUrl.slice(0, -1) + suffix : baseUrl + suffix,
    }
  }

  private formatEndpoint(endpoint: string) {
    return endpoint[0] === '/' ? endpoint : '/' + endpoint
  }

  private createUrl(endpoint: string, query?: Query) {
    const url = new URL(this.options.baseUrl + this.formatEndpoint(endpoint))
    const formattedQuery = Object.keys(query || {}).reduce((acc, key) => {
      if (typeof query?.[key] === 'number') {
        return {
          ...acc,
          [key]: query[key].toString()
        }
      }
      return {
        ...acc,
        [key]: query?.[key]
      }
    }, {})

    url.search = new URLSearchParams(formattedQuery).toString()
    return url
  }

  private async parseResponse(res: Response): Promise<[any | null, ClientError | Error | null]> {
    let data: string | null = await res.text()
    let error: ClientError | Error | null = null

    // Try to parse the response
    try {
      data = JSON.parse(data)
      if (!res.ok) {
        throw new Error()
      }
    } catch (e) {
      error = new ClientError({
        data,
        error: e as Error,
        status: res.status,
      })
      data = null
    }

    return [
      data,
      error
    ]
  }

  /**
   * This function is thread safe (if threadSafe is set to true, by default it's false)
   * that means that if multiple requests are made at the same time
   * only one will resolve the request, the others will wait for the first one to finish
   */
  private async request<T>(
    url: string,
    init: RequestInit & { options: RequestOptions }
  ): Promise<[T, ClientError | null]> {

    const config = init.options;

    // If there is cache, no need to continue
    // We return the cached value
    if (this.cache[url] && Date.now() - this.cache[url].timestamp < (config?.ttl || 0)) {
      return this.cache[url].output as any
    }

    // If the request is already being made
    // we wait for it to finish and return the output
    if (this.options.threadSafe && this.requestContext[url]?.mutex.isLocked()) {
      await this.requestContext[url].mutex.waitForUnlock()
      return this.requestContext[url].output
    }


    let res: Response | null = null
    let retryCount = 0
    let maxRetry = config.skipRetry
      ? 0 // If skipRetry, retry function will do nothing
      : this.options.maxRetry! // 3 by default

    // Apply custom max retry if defined
    if (config.maxRetry && config.maxRetry > 0) {
      maxRetry = config.maxRetry
    } else if (config.maxRetry && config.maxRetry < 0) {
      console.warn('maxRetry must be greater than 0, to bypass retry set skipRetry to true')
    }

    if (this.options.threadSafe && !this.requestContext[url]) {
      this.requestContext[url] = {} as any
      this.requestContext[url].mutex = new Mutex()
    }

    const release = this.options.threadSafe
      ? await this.requestContext[url].mutex.acquire()
      : undefined

    async function execute(this: Client) {

      if (maxRetry !== -1 && retryCount > maxRetry) {
        return
      }

      res = await fetch(url, {
        ...init,
        headers: {
          ...this.customHeaders,
          ...init.headers,
        }
      })

      if (this.hooks['afterRequest'] && !config.skipHooks?.includes('afterRequest')) {
        try {
          let next = Promise.resolve()
          await this.hooks['afterRequest'](res, {
            retry: async () => {
              next = execute.bind(this)()
            },
            retryCount: retryCount++
          })
          await next
        } catch (e) {
          console.error('Error in afterRequest hook', e)
          // TODO: handle error
        }
      }
    }

    await execute.bind(this)()

    const output = await this.parseResponse(res as any)

    // If ttl is defined, we cache the request
    // and set and expiration date
    if (config.ttl) {
      this.cache[url] = {
        output,
        timestamp: Date.now()
      }
    }

    if (this.options.threadSafe && release) {
      release()
      this.requestContext[url].output = output
    }

    return output as any
  }

  public addHook<T extends HookType>(hook: T, callback: HookCallback<T>) {
    this.hooks[hook] = callback as any
  }

  addHeaders(headers: Record<string, string>) {
    this.customHeaders = {
      ...this.customHeaders,
      ...headers,
    }
  }

  removeHeaders(headers?: Record<string, string>) {
    if (!headers) {
      this.customHeaders = {}
      return
    }
    for (const key in headers) {
      delete this.customHeaders[key]
    }
  }

  async get<T extends Record<string, any> | null>(endpoint: string, order: RequestOrder<'GET'> = {}) {
    const { query } = order
    const url = this.createUrl(endpoint, query)
    const request = await this.request<T>(url.toString(), {
      method: 'GET',
      options: order,
    })
    return request
  }

  async post<T extends Record<string, any>>(endpoint: string, order: RequestOrder<'POST'> = {}) {
    const { query, body } = order
    const url = this.createUrl(endpoint, query)

    const request = await this.request<T>(url.toString(), {
      method: 'POST',
      body: JSON.stringify(body),
      options: order,
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return request
  }

}
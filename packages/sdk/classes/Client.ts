import { HOST } from '../constants'
import { ClientError } from './ClientError'

import { Mutex } from 'async-mutex'

type Params = Record<string, string | number>

type RequestOrder<T extends 'GET' | 'POST'> = {
  endpoint: string
  ttl?: number // time to live of the req cache
  skipHooks?: HookType[]
  params?: Params
} & (
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
  // ...
) => Promise<void>

type HookCallback<T extends HookType> = T extends 'afterRequest'
  ? AfterRequestHook
  : BeforeRequestHook

type RequestContext = Record<string, {
  mutex: Mutex,
  output: any
}>

type ClientOptions = {
  threadSafe?: boolean
}

export class Client {

  private customHeaders: Record<string, string> = {}
  private hooks: Record<HookType, HookCallback<any>> = {} as any
  private cache: Record<string, { output: any, timestamp: number }> = {}
  private requestContext: RequestContext = {}
  private options: ClientOptions = {}

  constructor(options?: ClientOptions) {
    this.options = options || { threadSafe: false }
  }

  private formatEndpoint(endpoint: string) {
    return endpoint[0] === '/' ? endpoint : '/' + endpoint
  }

  private createUrl(endpoint: string, params?: Params) {
    const url = new URL(HOST + this.formatEndpoint(endpoint))
    const formattedParams = Object.keys(params || {}).reduce((acc, key) => {
      if (typeof params[key] === 'number') {
        return {
          ...acc,
          [key]: params[key].toString()
        }
      }
      return {
        ...acc,
        [key]: params[key]
      }
    }, {})

    url.search = new URLSearchParams(formattedParams).toString()
    return url
  }


  /**
   * This function is thread safe (if threadSafe is set to true, by default it's false)
   * that means that if multiple requests are made at the same time
   * only one will resolve the request, the others will wait for the first one to finish
   */
  private async request<T>(
    url: string,
    options: RequestInit & { config: { ttl?: number, skipHooks?: HookType[] } }
  ): Promise<[T, ClientError | Error | null]> {

    const config = options.config;

    // If there is cache, no need to continue
    // We return the cached value
    if (this.cache[url] && Date.now() - this.cache[url].timestamp < config.ttl) {
      return this.cache[url].output as any
    }

    // If the request is already being made
    // we wait for it to finish and return the output
    if (this.options.threadSafe && this.requestContext[url]?.mutex.isLocked()) {
      await this.requestContext[url].mutex.waitForUnlock()
      return this.requestContext[url].output
    }


    let res: Response
    let retryCount = 0

    if (this.options.threadSafe && !this.requestContext[url]) {
      this.requestContext[url] = {} as any
      this.requestContext[url].mutex = new Mutex()
    }

    const release = this.options.threadSafe
      ? await this.requestContext[url].mutex.acquire()
      : undefined

    async function execute(this: Client) {
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...this.customHeaders,
        }
      })

      if (this.hooks['afterRequest'] && !config.skipHooks?.includes('afterRequest')) {
        try {
          await this.hooks['afterRequest'](res, {
            retry: execute.bind(this),
            retryCount: retryCount++
          })
        } catch (e) {
          console.error('Error in afterRequest hook', e)
        }
      }
    }

    await execute.bind(this)()

    let data = await res.json()
    let error = res.ok ? null : new ClientError({
      data,
      status: res.status,
    })

    const output = [
      data,
      error
    ]

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
    this.hooks[hook] = callback
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

  async get<T extends Record<string, any> | null>(order: RequestOrder<'GET'> | string) {

    let preparedOrder: RequestOrder<'GET'> = typeof order === 'string'
      ? { endpoint: order }
      : order

    const { endpoint, params } = preparedOrder
    const url = this.createUrl(endpoint, params)

    const request = await this.request<T>(url.toString(), {
      method: 'GET',
      config: preparedOrder,
    })
    return request
  }

  async post<T extends Record<string, any>>(order: RequestOrder<'POST'>) {
    const { endpoint, params, body } = order
    const url = this.createUrl(endpoint, params)

    const request = await this.request<T>(url.toString(), {
      method: 'POST',
      body: JSON.stringify(body),
      config: order,
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return request
  }

}
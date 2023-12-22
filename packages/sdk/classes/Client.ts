import { HOST } from '../constants'
import { ClientError } from './ClientError'

import { Mutex } from 'async-mutex'

type RequestOrder<T extends 'GET' | 'POST'> = {
  endpoint: string
  ttl?: number // time to live of the req cache
  skipHooks?: HookType[]
  params?: Record<string, string>
} & (
    T extends 'POST'
    ? { body?: Record<string, any> }
    : {}
  )

type HookType = 'afterRequest' | 'beforeRequest'

type HookController = {
  retry: () => void
}

type HookCallback = (res: Response, controller: HookController) => Promise<void>

export class Client {

  private customHeaders: Record<string, string> = {}
  private hooks: Record<HookType, HookCallback> = {} as any

  private cache: Record<string, { output: any, timestamp: number }> = {}

  private mutexs: Record<string, Mutex> = {}

  private formatEndpoint(endpoint: string) {
    return endpoint[0] === '/' ? endpoint : '/' + endpoint
  }

  private createUrl(endpoint: string, params?: Record<string, string>) {
    const url = new URL(HOST + this.formatEndpoint(endpoint))
    url.search = new URLSearchParams(params).toString()
    return url
  }

  private async request<T>(url: string, options: RequestInit & { config: { ttl?: number, skipHooks?: HookType[] } }): Promise<[T, ClientError | Error | null]> {
    let res: Response

    const config = options.config;

    async function execute() {
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...this.customHeaders,
        }
      })
    }

    if (!this.mutexs[url]) {
      this.mutexs[url] = new Mutex()
    }

    const release = await this.mutexs[url].acquire()
    if (this.cache[url] && Date.now() - this.cache[url].timestamp < config.ttl) {
      release()
      return this.cache[url].output as any
    }

    const fn = execute.bind(this)
    await fn()
    if (this.hooks['afterRequest'] && !config.skipHooks?.includes('afterRequest')) {
      try {
        await this.hooks['afterRequest'](res, {
          retry: () => fn()
        })
      } catch (e) {
        release()
        return [
          null,
          e
        ]
      }
    }

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

    release()
    return output as any
  }

  public addHook(hook: HookType, callback: HookCallback) {
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

  async get<T extends Record<string, any>>(order: RequestOrder<'GET'>) {
    const { endpoint, params } = order
    const url = this.createUrl(endpoint, params)

    const request = await this.request<T>(url.toString(), {
      method: 'GET',
      config: order,
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
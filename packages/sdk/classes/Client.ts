import { HOST } from '../constants'

import type { Authentificator } from './Authentificator'
import { ClientError } from './ClientError'

type RequestOrder<T extends 'GET' | 'POST'> = {
  endpoint: string
  params?: Record<string, string>
} & (
    T extends 'POST'
    ? { body?: Record<string, any> }
    : {}
  )

export class Client {

  private customHeaders: Record<string, string> = {}

  private formatEndpoint(endpoint: string) {
    return endpoint[0] === '/' ? endpoint : '/' + endpoint
  }

  private createUrl(endpoint: string, params?: Record<string, string>) {
    const url = new URL(HOST + this.formatEndpoint(endpoint))
    url.search = new URLSearchParams(params).toString()
    return url
  }

  private async request<T>(url: string, options: RequestInit): Promise<[T, ClientError]> {
    try {
      const request = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...this.customHeaders,
        }
      })
      const data = await request.json()
      if (!request.ok) {
        throw new ClientError({
          status: request.status,
          data,
        })
      }
      return [data, null]
    } catch (e) {
      return [null, e]
    }
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
    })
    return request
  }

  async post<T extends Record<string, any>>(order: RequestOrder<'POST'>) {
    const { endpoint, params, body } = order
    const url = this.createUrl(endpoint, params)

    const request = await this.request<T>(url.toString(), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    return request
  }

}
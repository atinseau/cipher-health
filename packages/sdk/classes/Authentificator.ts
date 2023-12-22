import { Client } from "./Client"

import { UserType, UserModel } from '@cipher-health/api'


type AuthentificatorOptions = {
  mode: UserType
}

export class Authentificator {

  private client: Client;
  private options: AuthentificatorOptions;

  constructor(options: AuthentificatorOptions) {
    this.options = options;
    this.client = new Client();

    this.client.addHook('afterRequest', async (res, controller) => {
      if (res.status === 401) {
        await this.refresh()
        return controller.retry()
      }
    })

    this.applyHeaders()
  }

  private applyHeaders() {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      this.client.addHeaders({
        Authorization: `Bearer ${accessToken}`
      })
    }
  }

  private resetHeaders() {
    this.client.removeHeaders()
  }

  private async refresh() {
    const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>({
      endpoint: '/auth/refresh',
      skipHooks: ['afterRequest'],
      body: {
        refreshToken: localStorage.getItem('refreshToken'),
        accessToken: localStorage.getItem('accessToken')
      }
    })

    if (error) {
      throw error
    }

    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    this.applyHeaders()
  }

  async login({ email, password }: { email: string, password: string }) {
    const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>({
      endpoint: '/auth/signin',
      skipHooks: ['afterRequest'],
      params: {
        type: this.options.mode || 'CLIENT'
      },
      body: {
        email,
        password,
      }
    })
    if (error) {
      throw error
    }
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    this.applyHeaders()
  }

  async logout() {
    // Throw nothing if the user is not connected
    // just continue the logout process
    await this.client.get({
      endpoint: '/auth/signout'
    })

    // Remove tokens from local storage in any case
    // headers will be resetted after the request
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    this.resetHeaders()
  }

  async isConnected() {
    const softConnected = !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken')
    if (!softConnected) {
      return false
    }

    // Check if the token is still valid by trying to fetch the user profile
    try {
      await this.me()
    } catch (e) {
      return false
    }

    return true
  }

  async me() {
    let endpoint = '/user/me'

    if (this.options.mode === 'ADMIN') {
      endpoint = '/admin/me'
    } else if (this.options.mode === 'CLIENT') {
      endpoint = '/client/me'
    } else if (this.options.mode === 'WORKER') {
      // TODO: implement worker mode
    }

    const [res, error] = await this.client.get<{ data: UserModel }>({
      endpoint: endpoint,
      ttl: 1000
    })
    if (error) {
      throw error
    }
    return res.data
  }

  // public getClient() {
  //   return this.client
  // }
}
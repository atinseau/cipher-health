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

  async login({ email, password }: { email: string, password: string }) {
    const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>({
      endpoint: '/auth/signin',
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
    if (!this.isConnected) {
      return
    }

    // Remove tokens from local storage in any case
    // headers will be resetted after the request
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    const [res, error] = await this.client.get({
      endpoint: '/auth/signout'
    })

    if (error) {
      throw error
    }
    this.resetHeaders()
  }

  get isConnected() {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken')
  }


  async me() {
    const [res, error] = await this.client.get<{ data: UserModel }>({
      endpoint: '/user/me'
    })
    if (error) {
      throw error
    }
    return res.data
  }

}
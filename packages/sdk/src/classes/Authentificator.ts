import { Mutex } from "async-mutex";
import { Client } from "./Client"

import { UserType, UserModel } from '@cipher-health/api'


type AuthentificatorOptions = {
  mode: UserType
}

export class Authentificator {

  private client: Client;
  private options: AuthentificatorOptions;

  private refreshMutex = new Mutex()

  constructor(options?: AuthentificatorOptions) {
    this.options = options || { mode: 'CLIENT' };
    this.client = new Client({
      threadSafe: true,
    });

    this.client.addHook('afterRequest', async (res, controller) => {
      // If the token is expired, the server will return a 401
      // We try to refresh the token and retry the request
      // If the refresh fails, the initial request will fail
      // and it's the responsability to the user to handle the error
      if (res.status === 401 && controller.retryCount === 0) {
        await this.refresh()
        return controller.retry()
      }
    })

    // not implemented yet
    // this.client.addHook('beforeRequest', async () => {
    // ...
    // })

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

  /**
   * This function is thread safe
   * that means that if multiple requests are made at the same time
   * only one will refresh the token, the others will wait for the first one to finish
   */
  private async refresh() {

    if (!this.isSoftConnected()) {
      throw new Error('Cannot refresh token, not connected')
    }

    if (this.refreshMutex.isLocked()) {
      return this.refreshMutex.waitForUnlock()
    }

    const release = await this.refreshMutex.acquire()

    const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>('/auth/refresh', {
      skipHooks: ['afterRequest'],
      body: {
        refreshToken: localStorage.getItem('refreshToken'),
        accessToken: localStorage.getItem('accessToken')
      }
    })

    if (error) {
      release()
      throw error
    }

    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    this.applyHeaders()
    release()
  }

  async login({ email, password }: { email: string, password: string }) {

    // if already connected, do nothing
    if (await this.isConnected()) {
      return
    }

    const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>('/auth/signin', {
      skipHooks: ['afterRequest'],
      query: {
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

    // If there is no token, do nothing
    if (!this.isSoftConnected()) {
      return
    }

    // Throw nothing if the user is not connected
    // just continue the logout process
    await this.client.get('/auth/signout')

    console.log(localStorage.getItem('accessToken'))
    console.log(localStorage.getItem('refreshToken'))

    // Remove tokens from local storage in any case
    // headers will be resetted after the request
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    this.resetHeaders()
  }

  private isSoftConnected() {
    return !!localStorage.getItem('accessToken') && !!localStorage.getItem('refreshToken')
  }

  async isConnected() {
    if (!this.isSoftConnected()) {
      return false
    }

    // Check if the token is still valid by trying to fetch the user profile
    try {
      await this.me()
    } catch (e) {
      console.error('isConnected', e)
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

    const [res, error] = await this.client.get<{ data: UserModel }>(endpoint, {
      ttl: 5000
    })
    if (error) {
      throw error
    }
    return res.data
  }

  /**
   * Return the underlying client in the authentificator
   * This is useful to get an "authenticated" client that is thread safe
   * and that will automatically refresh the token if is needed when a request fail with a 401
   */
  getClient() {
    return this.client
  }
}
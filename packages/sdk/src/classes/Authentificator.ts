import { Mutex } from "async-mutex";
import { Client, ClientOptions } from "./Client"
import { UserType, UserModel } from '@cipher-health/api'
import { AuthentificatorAdapter } from "./adapters/AuthentificatorAdapter";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";

import type { signupSchema } from '@cipher-health/utils/schemas'
import type z from 'zod'

type AuthentificatorOptions = {
  mode?: UserType
  adapter?: AuthentificatorAdapter
  clientOptions?: Omit<ClientOptions, 'threadSafe'>
}

export class Authentificator {

  private client: Client;
  private options: AuthentificatorOptions;
  private adapter: AuthentificatorAdapter;

  private refreshMutex = new Mutex(undefined)

  constructor(options?: AuthentificatorOptions) {

    const {
      adapter,
      ...otherOptions
    } = options || {}

    this.adapter = adapter || new LocalStorageAdapter()

    this.options = {
      mode: 'CLIENT',
      clientOptions: {},
      ...otherOptions
    }
    this.client = new Client({
      ...this.options.clientOptions,
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

    this.applyHeaders()
  }

  private applyHeaders() {
    if (this.accessToken) {
      this.client.addHeaders({
        Authorization: `Bearer ${this.accessToken}`
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

    console.log('refresh')

    if (!this.isSoftConnected()) {
      throw new Error('Cannot refresh token, not connected')
    }

    if (this.refreshMutex.isLocked()) {
      return this.refreshMutex.waitForUnlock()
    }

    const release = await this.refreshMutex.acquire()

    let [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>('/auth/refresh', {
      skipHooks: ['afterRequest'],
      body: {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken
      }
    })

    if (error) {
      release()
      throw error
    }

    this.setAccessToken(res.data.accessToken)
    this.setRefreshToken(res.data.refreshToken)
    this.applyHeaders()
    release()
  }

  async login({ email, password }: { email: string, password: string }) {
    console.log('login')

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
    this.setAccessToken(res.data.accessToken)
    this.setRefreshToken(res.data.refreshToken)
    this.applyHeaders()
  }

  async signup(body: z.infer<typeof signupSchema>) {

    console.log("Authentificator: ", body)

  }

  async logout() {
    console.log('logout')

    // If there is no token, do nothing
    if (!this.isSoftConnected()) {
      return
    }

    // Throw nothing if the user is not connected
    // just continue the logout process
    await this.client.get('/auth/signout')

    // Remove tokens from local storage in any case
    // headers will be resetted after the request
    this.removeAccessToken()
    this.removeRefreshToken()

    this.resetHeaders()
  }

  private isSoftConnected() {
    return !!this.accessToken && !!this.refreshToken
  }

  async isConnected() {

    console.log('isConnected')

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

    console.log('me')

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


  private get accessToken() {
    return this.adapter.accessToken
  }

  private setAccessToken(token: string) {
    this.adapter.setAccessToken(token)
  }

  private get refreshToken() {
    return this.adapter.refreshToken
  }

  private removeRefreshToken() {
    this.adapter.removeRefreshToken()
  }

  private removeAccessToken() {
    this.adapter.removeAccessToken()
  }

  private setRefreshToken(token: string) {
    this.adapter.setRefreshToken(token)
  }

}
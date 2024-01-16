import { Mutex } from "async-mutex";
import { Client, ClientOptions } from "./Client"
import { UserType, UserModel, SignupInfo } from '@cipher-health/api'
import { AuthentificatorAdapter } from "./adapters/AuthentificatorAdapter";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";

import type { signupSchema } from '@cipher-health/utils/schemas'
import type z from 'zod'
import { ClientError } from "./ClientError";

type AuthentificatorOptions = {
  mode?: UserType
  debug?: boolean
  adapter?: AuthentificatorAdapter
  clientOptions?: Omit<ClientOptions, 'threadSafe'>
}

export class Authentificator {

  private client: Client;
  private adapter: AuthentificatorAdapter;
  private mode: UserType = 'CLIENT'

  private DEBUG_MODE = false

  private refreshing = {
    mutex: new Mutex(undefined),
    success: false
  }

  constructor(options?: AuthentificatorOptions) {

    const {
      adapter,
      clientOptions,
      debug,
      mode
    } = options || {}

    this.DEBUG_MODE = !!debug
    this.adapter = adapter || new LocalStorageAdapter()
    this.mode = mode || 'CLIENT'

    this.client = new Client({
      ...clientOptions,
      threadSafe: true,
    });

    this.client.addHook('afterRequest', async (res, controller) => {
      // If the token is expired, the server will return a 401
      // We try to refresh the token and retry the request
      // If the refresh fails, the initial request will fail
      // and it's the responsability to the user to handle the error
      if (res.status === 401 && controller.retryCount === 0) {
        if (await this.refresh(res.url)) {
          controller.retry()
        }
      }
    })

    this.applyHeaders()
  }

  private debug(method: string, ...args: any[]) {
    if (!this.DEBUG_MODE) {
      return
    }
    console.log(`[Authentificator] ${method}`, ...args)
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

  private clearSession() {
    this.removeRefreshToken()
    this.removeAccessToken()
    this.resetHeaders()
  }

  /**
   * This function is thread safe
   * that means that if multiple requests are made at the same time
   * only one will refresh the token, the others will wait for the first one to finish
   */
  private async refresh(url?: string) {
    this.debug('refresh', ' - ', url)
    if (!this.isSoftConnected()) {
      throw new Error('Cannot refresh token, not connected')
    }

    if (this.refreshing.mutex.isLocked()) {
      await this.refreshing.mutex.waitForUnlock()
      return this.refreshing.success
    }

    const release = await this.refreshing.mutex.acquire()

    let [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>('/auth/refresh', {
      skipHooks: ['afterRequest'],
      body: {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken
      }
    })

    if (error) {
      // If the refresh token is invalid, we remove it from the adapter
      this.clearSession()
      release()
      this.refreshing.success = false
      return false
    }

    this.setAccessToken(res.data.accessToken)
    this.setRefreshToken(res.data.refreshToken)
    this.applyHeaders()
    release()

    this.refreshing.success = true
    return true
  }

  async login({ email, password }: { email: string, password: string }) {
    this.debug('login', email, password)
    try {
      // if already connected, do nothing
      if (await this.isConnected()) {
        return
      }
      const [res, error] = await this.client.post<{ data: { accessToken: string, refreshToken: string } }>('/auth/signin', {
        skipHooks: ['afterRequest'],
        query: {
          type: this.mode || 'CLIENT'
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
    } catch (e) {
      // At this point, the user is not connected
      // and login attempt failed, so refreshing also failed
      // we can safely remove the tokens from the adapter before throwing the error
      this.clearSession()
      throw e
    }
  }

  async signup(body: z.infer<typeof signupSchema>): Promise<[any, Array<{ key: string, message: string }> | ClientError | null]> {
    this.debug('signup', body)
    const [res, error] = await this.client.post('/auth/signup', {
      body,
      skipHooks: [
        'afterRequest'
      ],
    })

    if (error && error.status === 409) {
      return [null, [{
        message: 'Email already used',
        key: 'email'
      }]]
    }

    if (error?.status === 422) {
      return [null, error.data?.map((e) => ({
        message: e.message,
        key: e.path[0]
      }))]
    }

    if (error) {
      return [null, error]
    }

    return [res, null]
  }

  async sendVerificationCode() {
    this.debug('sendVerificationCode')
    const [_, error] = await this.client.get('/auth/verify')
    if (error) {
      return false
    }
    return true
  }

  async verify(code: string): Promise<[any, ClientError | null]> {
    this.debug('verify', code)
    const [res, error] = await this.client.post('/auth/verify/callback', {
      body: {
        code
      }
    })
    return [
      res?.data || null,
      error
    ]
  }

  async logout() {
    this.debug('logout')

    // If there is no token, do nothing
    if (!this.isSoftConnected()) {
      return
    }

    // Throw nothing if the user is not connected
    // just continue the logout process
    await this.client.get('/auth/signout')

    // Remove tokens from local storage in any case
    // headers will be resetted after the request
    this.clearSession()
  }

  private isSoftConnected() {
    return !!this.accessToken && !!this.refreshToken
  }

  async isSafelyConnected() {
    if (!this.isSoftConnected()) {
      return {
        success: false,
        data: null
      }
    }

    // Check if the token is still valid by trying to fetch the user profile
    try {
      await this.me()
    } catch (e) {

      // If the server is down, throw the error to the user
      if (e.status === 500) {
        throw e
      }

      // 403 is not an error, it means that the user havn't completed his profile yet
      // so is considered as connected
      if (e.status === 403) {
        return {
          success: true,
          data: e
        }
      }

      return {
        success: false,
        data: e
      }
    }

    return {
      success: true,
      data: null
    }
  }

  // this method should never throw an error
  async getSignupInfo() {
    this.debug('getSignupInfo')
    if (!this.isSoftConnected()) {
      return null
    }

    const [res, error] = await this.client.get<{ data: SignupInfo }>('/auth/signup/info')

    if (error) {
      return null
    }

    return res.data
  }

  async isConnected() {
    const result = await this.isSafelyConnected()
    return result.success
  }

  async me(): Promise<UserModel> {
    this.debug('me')

    let endpoint = '/user/me'

    if (this.mode === 'ADMIN') {
      endpoint = '/admin/me'
    } else if (this.mode === 'CLIENT') {
      endpoint = '/client/me'
    } else if (this.mode === 'WORKER') {
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
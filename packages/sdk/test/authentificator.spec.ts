import { Authentificator } from "../src"

import applyMockedLocalStorage from "./mock/localStorage"
import applyMockedFetch, { createFetchResult, Route } from "./mock/fetch"

const HOST = 'http://localhost:8080'

let refreshToken = "0"
let accessToken = "0"

const loginRoute: Route = {
  endpoint: '/api/v1/auth/signin',
  method: 'POST',
  fetchResult: createFetchResult({
    error: false,
    status: 200,
    data: JSON.stringify({
      data: {
        accessToken,
        refreshToken
      }
    })
  })
}

const meRoute: Route = {
  endpoint: '/api/v1/admin/me',
  method: 'GET',
  fetchResult: createFetchResult({
    error: false,
    status: 200,
    data: JSON.stringify({
      data: {
        id: 'id',
        email: 'john@doe.com'
      }
    })
  })
}

const logoutRoute: Route = {
  endpoint: '/api/v1/auth/signout',
  method: 'GET',
  fetchResult: createFetchResult({
    error: false,
    status: 200,
    data: JSON.stringify({})
  })
}

const refreshRoute: Route = {
  endpoint: '/api/v1/auth/refresh',
  method: 'POST',
  fetchResult: () => {
    refreshToken = (parseInt(refreshToken) + 1).toString()
    accessToken = (parseInt(accessToken) + 1).toString()
    return createFetchResult({
      error: false,
      status: 200,
      data: JSON.stringify({
        data: {
          accessToken: accessToken.toString(),
          refreshToken: refreshToken.toString()
        }
      })
    })
  }
}

describe('Authentificator', () => {
  beforeEach(() => {
    // @ts-ignore
    global.localStorage = undefined

    // @ts-ignore
    global.fetch = undefined
    refreshToken = "0"
    accessToken = "0"
  })

  it('should create an instance', () => {
    applyMockedLocalStorage()

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })
    expect(authentificator).toBeDefined()
    expect(authentificator).toBeInstanceOf(Authentificator)
    expect(authentificator.getClient()['options'].baseUrl).toBe(HOST + '/api/v1')
  })

  it('should be able to login', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    mockedFetch.fetchContext.addRoute(loginRoute)

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      await authentificator.login({
        email: 'john@doe.com',
        password: 'password'
      })
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[loginRoute.endpoint]).toBe(1)
    expect(localStorage.getItem('accessToken')).toBe("0")
    expect(localStorage.getItem('refreshToken')).toBe("0")
    expect(authentificator['isSoftConnected']()).toBe(true)
    expect(authentificator.getClient()['customHeaders']).toEqual({
      Authorization: 'Bearer 0'
    })
  })

  it('skip login if token is in localStorage', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    mockedFetch.fetchContext.addRoute(loginRoute)
    mockedFetch.fetchContext.addRoute(meRoute)

    localStorage.setItem('accessToken', 'accessToken')
    localStorage.setItem('refreshToken', 'refreshToken')

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      await authentificator.login({
        email: 'john@doe.com',
        password: 'password'
      })
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[loginRoute.endpoint]).toBe(0)
    expect(mockedFetch.fetchContext.countByRoute[meRoute.endpoint]).toBe(1)
    expect(localStorage.getItem('accessToken')).toBe('accessToken')
    expect(localStorage.getItem('refreshToken')).toBe('refreshToken')
    expect(authentificator['isSoftConnected']()).toBe(true)
    expect(authentificator.getClient()['customHeaders']).toEqual({
      Authorization: 'Bearer accessToken'
    })

  })

  it('should be able to logout', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    mockedFetch.fetchContext.addRoute(logoutRoute)

    // Restore tokens (auth)
    localStorage.setItem('accessToken', 'accessToken')
    localStorage.setItem('refreshToken', 'refreshToken')

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      await authentificator.logout()
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[logoutRoute.endpoint]).toBe(1)
    expect(localStorage.getItem('accessToken')).toBeUndefined()
    expect(localStorage.getItem('refreshToken')).toBeUndefined()
    expect(authentificator['isSoftConnected']()).toBe(false)
    expect(Object.keys(authentificator.getClient()['customHeaders'])).not.toContain('Authorization')
  })

  it('should be able to refresh token', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    mockedFetch.fetchContext.addRoute(refreshRoute)

    // Restore tokens (auth)
    localStorage.setItem('accessToken', accessToken.toString())
    localStorage.setItem('refreshToken', refreshToken.toString())

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      await authentificator['refresh']()
      await authentificator['refresh']()
      await authentificator['refresh']()
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[refreshRoute.endpoint]).toBe(3)
    expect(localStorage.getItem('accessToken')).toBe("3")
    expect(localStorage.getItem('refreshToken')).toBe("3")
    expect(authentificator['isSoftConnected']()).toBe(true)
    expect(authentificator.getClient()['customHeaders']).toEqual({
      Authorization: 'Bearer 3'
    })
  })

  it('should be able to refresh token when session is expired', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    let firstMeCall = true

    mockedFetch.fetchContext.addRoute(refreshRoute)
    mockedFetch.fetchContext.addRoute({
      endpoint: '/api/v1/admin/me',
      method: 'GET',
      fetchResult: () => {
        if (firstMeCall) {
          firstMeCall = false
          return createFetchResult({
            error: true,
            status: 401,
          })
        }
        return createFetchResult({
          data: JSON.stringify({
            data: {
              id: 'id',
              email: 'john@doe.fr'
            }
          })
        })
      }
    })

    // Restore tokens (auth)
    localStorage.setItem('accessToken', accessToken.toString())
    localStorage.setItem('refreshToken', refreshToken.toString())

    expect(localStorage.getItem('accessToken')).toBe("0")
    expect(localStorage.getItem('refreshToken')).toBe("0")

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      const user = await authentificator.me()
      expect(user.email).toBe('john@doe.fr')
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[refreshRoute.endpoint]).toBe(1)
    expect(mockedFetch.fetchContext.countByRoute[meRoute.endpoint]).toBe(2)
    expect(localStorage.getItem('accessToken')).toBe("1")
    expect(localStorage.getItem('refreshToken')).toBe("1")
    expect(authentificator['isSoftConnected']()).toBe(true)
    expect(authentificator.getClient()['customHeaders']).toEqual({
      Authorization: 'Bearer 1'
    })
  })

  it('should be able to wait for other refresh call', async () => {
    applyMockedLocalStorage()
    const mockedFetch = applyMockedFetch()

    mockedFetch.fetchContext.addRoute(refreshRoute)

    // Restore tokens (auth)
    localStorage.setItem('accessToken', accessToken.toString())
    localStorage.setItem('refreshToken', refreshToken.toString())

    const authentificator = new Authentificator({
      mode: 'ADMIN',
      clientOptions: {
        baseUrl: HOST
      }
    })

    try {
      authentificator['refresh']()
      authentificator['refresh']()
      authentificator['refresh']()

      await authentificator['refresh']()
    } catch (e) {
      // should not throw
      expect(e).toBeUndefined()
    }

    expect(mockedFetch.fetchContext.countByRoute[refreshRoute.endpoint]).toBe(1)
    expect(localStorage.getItem('accessToken')).toBe("1")
    expect(localStorage.getItem('refreshToken')).toBe("1")
    expect(authentificator['isSoftConnected']()).toBe(true)
    expect(authentificator.getClient()['customHeaders']).toEqual({
      Authorization: 'Bearer 1'
    })
  })

})
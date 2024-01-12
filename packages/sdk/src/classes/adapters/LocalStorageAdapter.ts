import { AuthentificatorAdapter } from "./AuthentificatorAdapter";


export class LocalStorageAdapter implements AuthentificatorAdapter {

  get accessToken() {
    return localStorage.getItem('accessToken')
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token)
  }

  get refreshToken() {
    return localStorage.getItem('refreshToken')
  }

  removeRefreshToken() {
    localStorage.removeItem('refreshToken')
  }

  removeAccessToken() {
    localStorage.removeItem('accessToken')
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token)
  }
}
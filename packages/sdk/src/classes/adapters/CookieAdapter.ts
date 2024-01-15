import { AuthentificatorAdapter } from "./AuthentificatorAdapter";
import Cookies from 'js-cookie'

export class CookieAdapter implements AuthentificatorAdapter {
  get accessToken() {
    return Cookies.get('accessToken')
  }
  get refreshToken() {
    return Cookies.get('refreshToken')
  }
  setAccessToken(token: string): void {
    Cookies.set('accessToken', token)
  }
  setRefreshToken(token: string): void {
    Cookies.set('refreshToken', token)
  }
  removeRefreshToken(): void {
    Cookies.remove('refreshToken')
  }
  removeAccessToken(): void {
    Cookies.remove('accessToken')
  }
}
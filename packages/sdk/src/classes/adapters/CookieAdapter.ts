import { AuthentificatorAdapter } from "./AuthentificatorAdapter";


export class CookieAdapter implements AuthentificatorAdapter {
  get accessToken(): string {
    return ""
  }
  get refreshToken(): string {
    return ""
  }
  setAccessToken(token: string): void {
    throw new Error("Method not implemented.");
  }
  setRefreshToken(token: string): void {
    throw new Error("Method not implemented.");
  }
  removeRefreshToken(): void {
    throw new Error("Method not implemented.");
  }
  removeAccessToken(): void {
    throw new Error("Method not implemented.");
  }
}
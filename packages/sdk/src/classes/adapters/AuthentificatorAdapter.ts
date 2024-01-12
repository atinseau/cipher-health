

export abstract class AuthentificatorAdapter {

  abstract get accessToken(): string | null
  abstract get refreshToken(): string | null

  abstract setAccessToken(token: string): void
  abstract setRefreshToken(token: string): void

  abstract removeRefreshToken(): void
  abstract removeAccessToken(): void
}
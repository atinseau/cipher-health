

export abstract class AuthentificatorAdapter {

  abstract get accessToken(): string | undefined | null
  abstract get refreshToken(): string | undefined | null

  abstract setAccessToken(token: string): void
  abstract setRefreshToken(token: string): void

  abstract removeRefreshToken(): void
  abstract removeAccessToken(): void
}
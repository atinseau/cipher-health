
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      REDIS_HOST: string
      REDIS_PORT: string
    }
  }
}

export {}
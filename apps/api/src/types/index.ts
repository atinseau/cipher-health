

export type SafeResult<T, Error = any> = {
  success: true
  data: T
} | {
  success: false
  error: Error
}
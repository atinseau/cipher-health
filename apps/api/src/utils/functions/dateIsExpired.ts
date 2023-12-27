
function roundSeconds(date: Date) {
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export function dateIsExpired(date: Date, cursor?: number) {
  const now = new Date()
  const internal = new Date(date)

  if (cursor) {
    internal.setTime(internal.getTime() + cursor)
  }

  const internalTime = roundSeconds(internal).getTime()
  const nowTime = roundSeconds(now).getTime()

  if (internalTime >= nowTime) {
    return false
  }

  return true
}
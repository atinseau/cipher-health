import { useEffect, useRef } from 'react'

type ResultCallback = void | (() => void)
type Callback = (() => (void | (() => void))) | (() => Promise<ResultCallback>)

export default function useMount(callback: Callback) {

  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      return
    }
    mounted.current = true

    const result = callback()

    return result instanceof Promise
      ? () => result.then((cb) => cb && cb())
      : result
  }, [])

}
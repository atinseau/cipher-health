export type Route = {
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  fetchResult: ReturnType<typeof createFetchResult> | ((init?: RequestInit) => ReturnType<typeof createFetchResult>)
}

type FetchContext = {
  count: number,
  countByRoute: Record<string, number>,
  addRoute: (route: Route) => void
}

type FetchResultOptions = {
  error?: boolean | (() => boolean), // error on all requests
  data?: string | (() => string), // the data to return on all requests
  status?: number | (() => number), // the status to return on all requests
}

export const createFetchResult = (options?: FetchResultOptions) => {

  const defaultData = typeof options?.data === 'function' ? options?.data() : options?.data
  const defaultText = defaultData || 'ok' // TODO: change the "ok"
  const error = typeof options?.error === 'function' ? options?.error() : options?.error
  const status = typeof options?.status === 'function' ? options?.status() : options?.status

  return Promise.resolve({
    ok: !error,
    status: error ? (status || 500) : 200,
    json: () => {
      try {
        return Promise.resolve(JSON.parse(defaultText))
      } catch (_) {
        return Promise.reject(defaultText)
      }
    },
    text: () => Promise.resolve(defaultText)
  })
}

function applyMockedFetch(options?: FetchResultOptions) {

  const routes: Route[] = []

  const countByRoute: Record<string, number> = {}

  const fetchContext: FetchContext = {
    count: 0,
    countByRoute,
    addRoute: (route) => {
      countByRoute[route.endpoint] = 0
      routes.push(route)
    }
  }

  const customFetch = (input: URL | RequestInfo, init?: RequestInit) => {
    const url = new URL(input.toString())
    const route = routes.find((r) => r.endpoint === url.pathname && r.method === (init?.method || 'GET'))

    if (route) {
      fetchContext.countByRoute[route.endpoint] += 1
      return typeof route.fetchResult === 'function' ? route.fetchResult(init) : route.fetchResult
    }

    fetchContext.count += 1
    return createFetchResult(options)
  }

  const mockedFetch = jest.fn(customFetch) as jest.Mock<ReturnType<typeof customFetch>> & {
    fetchContext: FetchContext
  }

  // @ts-ignore
  global.fetch = mockedFetch

  mockedFetch.fetchContext = fetchContext

  return mockedFetch
}

export default applyMockedFetch
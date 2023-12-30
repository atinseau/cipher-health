import { Client } from "../src/classes/Client"
import { ClientError } from "../src/classes/ClientError"
import applyMockedFetch from "./mock/fetch"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))


const response = {
  message: 'Hello World!'
}

describe('Client class', () => {

  // to be sure mockRestore is called
  beforeEach(() => {
    global.fetch = undefined
  })

  it('should be able to make a simple request', async () => {
    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response)
    })

    let client = new Client()

    const [data, error] = await client.get('mocked-url')

    expect(error).toBeNull()
    expect(data).toEqual(response)

    mockedFetch.mockRestore()
  })

  it('should be able to handle errors in a simple request', async () => {

    let client = new Client()

    const mockedFetch = applyMockedFetch({
      error: true,
      data: JSON.stringify({ "message": "error" }), // to prevent json parsing error
    })

    const [data, error] = await client.get('mocked-url')

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(ClientError)
    expect(error?.message).toBe(JSON.stringify({ "message": "error" }))

    mockedFetch.mockRestore()
  })

  it('should be able to handle json errors in a simple request', async () => {

    let client = new Client()

    const mockedFetch = applyMockedFetch({
      error: false, // Should not be an error but the json parsing should fail
      data: 'not-json',
    })

    const [data, error] = await client.get('mocked-url')

    let fakeJsonError: Error = null

    try {
      JSON.parse('not-json')
    } catch (e) {
      fakeJsonError = e
    }

    expect(data).toBeNull()
    expect(error).toBeInstanceOf(ClientError)
    expect(error?.message).toBe(error?.message)

    mockedFetch.mockRestore()
  })

  it('should able to fire multi request at same time (unsafe-thread)', async () => {
    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response)
    })

    let client = new Client()

    const p1 = client.get('mocked-url')
    const p2 = client.get('mocked-url')
    const p3 = client.get('mocked-url')
    const p4 = client.get('mocked-url')

    const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4])

    expect(r1[0]).toEqual(response)
    expect(r2[0]).toEqual(response)
    expect(r3[0]).toEqual(response)
    expect(r4[0]).toEqual(response)

    expect(r1[1]).toBeNull()
    expect(r2[1]).toBeNull()
    expect(r3[1]).toBeNull()
    expect(r4[1]).toBeNull()

    expect(mockedFetch.fetchContext.count).toBe(4)

    mockedFetch.mockRestore()
  })

  it('should able to group request in safe thread way (one resolve, multi call)', async () => {
    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response)
    })

    let client = new Client({
      threadSafe: true
    })

    const p1 = client.get('mocked-url')
    const p2 = client.get('mocked-url')
    const p3 = client.get('mocked-url')
    const p4 = client.get('mocked-url')

    const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4])

    expect(r1[0]).toEqual(response)
    expect(r2[0]).toEqual(response)
    expect(r3[0]).toEqual(response)
    expect(r4[0]).toEqual(response)

    expect(r1[1]).toBeNull()
    expect(r2[1]).toBeNull()
    expect(r3[1]).toBeNull()
    expect(r4[1]).toBeNull()

    // This should be 1 because the first request will resolve and the others will wait for it
    expect(mockedFetch.fetchContext.count).toBe(1)

    mockedFetch.mockRestore()
  })

  it('should handle error on thread safe way', async () => {
    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      threadSafe: true
    })

    const p1 = client.get('mocked-url')
    const p2 = client.get('mocked-url')

    const [r1, r2] = await Promise.all([p1, p2])

    expect(r1[0]).toBeNull()
    expect(r2[0]).toBeNull()

    expect(r1[1]).toBeInstanceOf(ClientError)
    expect(r2[1]).toBeInstanceOf(ClientError)

    expect(mockedFetch.fetchContext.count).toBe(1)

    mockedFetch.mockRestore()
  })

  it('should able to set hook (afterRequest)', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response)
    })

    let client = new Client()

    client.addHook('afterRequest', async (res, controller) => {
      res.text = () => {
        return Promise.resolve(JSON.stringify({
          message: 'Hello World From Hook!'
        }))
      }
    })

    const [data, error] = await client.get('mocked-url')

    expect(error).toBeNull()
    expect(data).toEqual({
      message: 'Hello World From Hook!'
    })

    mockedFetch.mockRestore()
  })

  it('should be able to retry request from hook (afterRequest)', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      maxRetry: 3,
    })

    client.addHook('afterRequest', async (res, controller) => {
      if (!res.ok) {
        controller.retry()
      }
    })

    const [data, error] = await client.get('mocked-url')

    expect(error).toBeInstanceOf(ClientError)
    expect(data).toBeNull()
    expect(mockedFetch.fetchContext.count).toBe(4)

    mockedFetch.mockRestore()
  })

  it('should be able to retry request from hook (afterRequest, multi call unsafe)', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      maxRetry: 3,
    })

    client.addHook('afterRequest', async (res, controller) => {
      if (!res.ok) {
        controller.retry()
      }
    })

    client.get('mocked-url') // first try with 3 next retry
    client.get('mocked-url') // first try with 3 next retry
    client.get('mocked-url') // first try with 3 next retry

    const [data, error] = await client.get('mocked-url') // first try with 3 next retry

    expect(error).toBeInstanceOf(ClientError)
    expect(data).toBeNull()

    // So we have 4 request (1 first try + 3 retry) * 4 (4 calls)
    // So we expect to have 16 request
    expect(mockedFetch.fetchContext.count).toBe(16)

    mockedFetch.mockRestore()
  })

  it('should be able to retry request from hook (afterRequest, thread-safe)', async () => {
    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      maxRetry: 3,
      threadSafe: true
    })

    client.addHook('afterRequest', async (res, controller) => {
      if (!res.ok) {
        controller.retry()
      }
    })

    client.get('mocked-url') // first try with 3 next retry
    client.get('mocked-url') // no produce request because the first one is not resolved
    client.get('mocked-url') // no produce request because the first one is not resolved

    // no produce request because the first one is not resolved
    // wait for the first one to resolve and retry
    const [data, error] = await client.get('mocked-url')

    expect(error).toBeInstanceOf(ClientError)
    expect(data).toBeNull()

    // Client is thread safe so we have only 1 request
    // So we expect to have 4 request (1 first try + 3 retry)
    expect(mockedFetch.fetchContext.count).toBe(4)

    mockedFetch.mockRestore()
  })

  it('should be able to disable retry from a request order', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      maxRetry: 3,
    })

    client.addHook('afterRequest', async (res, controller) => {
      if (!res.ok) {
        controller.retry()
      }
    })

    const [data, error] = await client.get('mocked-url', {
      skipRetry: true,
      // maxRetry: 0 <--- it will do the same thing
    })

    expect(error).toBeInstanceOf(ClientError)
    expect(data).toBeNull()
    expect(mockedFetch.fetchContext.count).toBe(1)

    mockedFetch.mockRestore()

  })

  it('should be able to custom retry count from a request order', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
      error: true
    })

    let client = new Client({
      maxRetry: 3,
    })

    client.addHook('afterRequest', async (res, controller) => {
      if (!res.ok) {
        controller.retry()
      }
    })

    const [data, error] = await client.get('mocked-url', {
      maxRetry: 10 // override default maxRetry (3)
    })

    expect(error).toBeInstanceOf(ClientError)
    expect(data).toBeNull()
    expect(mockedFetch.fetchContext.count).toBe(11)

    mockedFetch.mockRestore()
  })

  it('should be able to ignore hook from a request order', async () => {

    const mockedFetch = applyMockedFetch({
      data: JSON.stringify(response),
    })

    let client = new Client()

    // This hook should not be called
    client.addHook('afterRequest', async (res, controller) => {
      res.text = () => {
        return Promise.resolve(JSON.stringify({
          message: 'Hello World From Hook!'
        }))
      }
    })

    const [data, error] = await client.get('mocked-url', {
      skipHooks: ['afterRequest'],
    })

    expect(error).toBeNull()
    expect(data).toEqual(response)
    expect(mockedFetch.fetchContext.count).toBe(1)

    mockedFetch.mockRestore()
  })

  it('should be able to set custom headers', () => {
    let client = new Client()

    client.addHeaders({
      'X-Test': 'test',
      'X-Test2': 'test2',
    })

    expect(client['customHeaders']['X-Test']).toBe('test')
    expect(client['customHeaders']['X-Test2']).toBe('test2')

    // Should be able to override headers and add new ones
    client.addHeaders({
      'X-Test': 'test3',
      'X-Test4': 'test4',
    })

    expect(client['customHeaders']['X-Test']).toBe('test3')
    expect(client['customHeaders']['X-Test2']).toBe('test2') // Should not be removed
    expect(client['customHeaders']['X-Test4']).toBe('test4')
  })

  it('should be able to keep response in cache if ttl is setted', async () => {

    let initialTime = null

    const mockedFetch = applyMockedFetch({
      data: () => {
        let now = Date.now()
        if (!initialTime) {
          initialTime = Date.now()
          now = initialTime // Simulate a request where the response change over time
        }
        return JSON.stringify({
          date: now
        })
      },
    })

    let client = new Client()

    const [data1, error1] = await client.get('mocked-url')

    await sleep(1000) // Wait 1 second to simulate a new request

    const [data2, error2] = await client.get('mocked-url')

    expect(error1).toBeNull()
    expect(error2).toBeNull()
    expect(data1).not.toEqual(data2) // Verify that the response is not the same

    // Now we set a ttl of 2 seconds

    initialTime = null // Reset the initial time

    const [data3, error3] = await client.get('mocked-url', {
      ttl: 2000
    })

    await sleep(1000) // Wait 1 second to simulate a new request

    const [data4, error4] = await client.get('mocked-url', {
      ttl: 2000
    })

    expect(error3).toBeNull()
    expect(error4).toBeNull()
    expect(data3).toEqual(data4) // Verify that the response is the same

    mockedFetch.mockRestore()
  })
})
const applyMockedLocalStorage = () => {
  let localStorageCache = {}
  global.localStorage = {
    getItem: (key: string) => localStorageCache[key],
    setItem: (key: string, value: string) => localStorageCache[key] = value,
    removeItem: (key: string) => delete localStorageCache[key],
    clear: () => localStorageCache = {},
    key: (index: number) => Object.keys(localStorageCache)[index],
    length: Object.keys(localStorageCache).length
  }
}

export default applyMockedLocalStorage
import {
  setCache,
  getCacheWithStale,
  getCache,
  clearCache,
  clearAllCache,
  hasCache,
} from "../../lib/cache"

describe("Cache utilities", () => {
  beforeEach(() => {
    clearAllCache()
    jest.useFakeTimers()
  })

  afterEach(() => {
    clearAllCache()
    jest.useRealTimers()
  })

  afterEach(() => {
    clearAllCache()
    jest.useRealTimers()
  })

  describe("setCache", () => {
    it("debe establecer un valor en el caché", () => {
      const data = { id: 1, name: "test" }
      setCache("user", data, { ttl: 60, staleTime: 30 })

      expect(hasCache("user")).toBe(true)
    })
  })

  describe("getCache", () => {
    it("debe devolver datos válidos cuando no han expirado", () => {
      const data = { id: 1, name: "test" }
      setCache("user", data, { ttl: 60, staleTime: 30 })

      expect(getCache("user")).toEqual(data)
    })
  })

  describe("getCacheWithStale", () => {
    it("debe devolver datos no obsoletos cuando están dentro de staleTime", () => {
      const data = { id: 1, name: "test" }
      setCache("user", data, { ttl: 60, staleTime: 30 })

      const result = getCacheWithStale("user")
      expect(result.data).toEqual(data)
      expect(result.isStale).toBe(false)
    })
  })

  describe("clearCache", () => {
    it("debe eliminar una entrada específica del caché", () => {
      setCache("key1", "value1", { ttl: 60, staleTime: 30 })
      setCache("key2", "value2", { ttl: 60, staleTime: 30 })

      clearCache("key1")

      expect(hasCache("key1")).toBe(false)
      expect(hasCache("key2")).toBe(true)
    })
  })

  describe("clearAllCache", () => {
    it("debe eliminar todas las entradas del caché", () => {
      setCache("key1", "value1", { ttl: 60, staleTime: 30 })
      setCache("key2", "value2", { ttl: 60, staleTime: 30 })
      setCache("key3", "value3", { ttl: 60, staleTime: 30 })

      clearAllCache()

      expect(hasCache("key1")).toBe(false)
      expect(hasCache("key2")).toBe(false)
      expect(hasCache("key3")).toBe(false)
    })
  })
})

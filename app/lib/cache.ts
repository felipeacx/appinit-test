interface CacheEntry {
  data: unknown
  timestamp: number
  ttl: number
  staleTime: number
}

interface CacheConfig {
  ttl: number
  staleTime: number
}

// Almacenamiento en caché en memoria
const cacheStore = new Map<string, CacheEntry>()

/**
 * Establecer un valor en el caché con TTL (tiempo de vida) y tiempo obsoleto
 * @param key - La clave del caché
 * @param data - Los datos a guardar en caché
 * @param config - Configuración del caché con ttl (en segundos) y staleTime (en segundos)
 */
export function setCache(key: string, data: unknown, config: CacheConfig): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    ttl: config.ttl * 1000, // Convertir a milisegundos
    staleTime: config.staleTime * 1000, // Convertir a milisegundos
  })
}

/**
 * Obtener un valor del caché con información de obsolencia
 * @param key - La clave del caché
 * @returns Objeto con datos y bandera isStale, o { data: null, isStale: false } si no se encuentra
 */
export function getCacheWithStale(key: string): { data: unknown; isStale: boolean } {
  const entry = cacheStore.get(key)

  if (!entry) {
    return { data: null, isStale: false }
  }

  const age = Date.now() - entry.timestamp

  // Si los datos han expirado pasado el TTL, no devuelve nada
  if (age > entry.ttl) {
    cacheStore.delete(key)
    return { data: null, isStale: false }
  }

  // Si los datos están obsoletos (pasado staleTime pero dentro de TTL), marcalos como obsoletos
  const isStale = age > entry.staleTime

  return { data: entry.data, isStale }
}

/**
 * Obtener un valor del caché sin información de obsolencia
 * @param key - La clave del caché
 * @returns Los datos en caché o null si no se encuentra o ha expirado
 */
export function getCache(key: string): unknown {
  const entry = cacheStore.get(key)

  if (!entry) {
    return null
  }

  const age = Date.now() - entry.timestamp

  // Si los datos han expirado, elimínalos y devuelve nulo
  if (age > entry.ttl) {
    cacheStore.delete(key)
    return null
  }

  return entry.data
}

/**
 * Limpiar una entrada específica del caché
 * @param key - La clave del caché a limpiar
 */
export function clearCache(key: string): void {
  cacheStore.delete(key)
}

/**
 * Limpiar todas las entradas del caché
 */
export function clearAllCache(): void {
  cacheStore.clear()
}

/**
 * Verificar si una clave existe en el caché y no ha expirado
 * @param key - La clave del caché
 * @returns verdadero si la clave existe y no ha expirado, falso en caso contrario
 */
export function hasCache(key: string): boolean {
  const entry = cacheStore.get(key)

  if (!entry) {
    return false
  }

  const age = Date.now() - entry.timestamp

  // Si los datos han expirado, elimínalos y devuelve falso
  if (age > entry.ttl) {
    cacheStore.delete(key)
    return false
  }

  return true
}

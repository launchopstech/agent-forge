/**
 * Mock API engine — provides latency simulation, error injection,
 * and in-memory CRUD stores for development without a backend.
 */

export interface MockApiConfig {
  latency: { min: number; max: number }
  errorRate: number
}

let config: MockApiConfig = {
  latency: { min: 200, max: 800 },
  errorRate: 0,
}

/** Configure mock API behaviour globally (use min/max 0 in tests). */
export function configureMockApi(overrides: Partial<MockApiConfig>): void {
  config = { ...config, ...overrides }
}

/** Reset mock API config to defaults. */
export function resetMockApiConfig(): void {
  config = { latency: { min: 200, max: 800 }, errorRate: 0 }
}

/** Get the current mock API config (read-only). */
export function getMockApiConfig(): Readonly<MockApiConfig> {
  return config
}

export class MockApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'MockApiError'
    this.status = status
  }
}

/** Simulate network latency. Resolves after a random delay within config range. */
export async function simulateLatency(): Promise<void> {
  const { min, max } = config.latency
  if (min === 0 && max === 0) return
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/** Throw MockApiError if random roll is below the configured error rate. */
export function maybeThrowError(): void {
  if (config.errorRate > 0 && Math.random() < config.errorRate) {
    throw new MockApiError('Simulated server error', 500)
  }
}

/** Generic in-memory CRUD store backed by an array. */
export interface MockStore<T> {
  getAll: () => T[]
  getById: (id: string) => T | undefined
  create: (item: T) => T
  update: (id: string, patch: Partial<T>) => T
  remove: (id: string) => void
  reset: () => void
}

export function createMockStore<T extends { id: string }>(initialData: T[]): MockStore<T> {
  const seed = structuredClone(initialData)
  let items = structuredClone(initialData)

  return {
    getAll: () => [...items],
    getById: (id) => items.find((item) => item.id === id),
    create: (item) => {
      const clone = structuredClone(item)
      items = [...items, clone]
      return clone
    },
    update: (id, patch) => {
      const idx = items.findIndex((item) => item.id === id)
      if (idx === -1) throw new MockApiError(`Item ${id} not found`, 404)
      const updated = { ...items[idx], ...patch } as T
      items = items.map((item, i) => (i === idx ? updated : item))
      return structuredClone(updated)
    },
    remove: (id) => {
      const idx = items.findIndex((item) => item.id === id)
      if (idx === -1) throw new MockApiError(`Item ${id} not found`, 404)
      items = items.filter((_, i) => i !== idx)
    },
    reset: () => {
      items = structuredClone(seed)
    },
  }
}

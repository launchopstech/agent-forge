import { describe, it, expect, beforeEach } from 'vitest'
import {
  configureMockApi,
  resetMockApiConfig,
  getMockApiConfig,
  simulateLatency,
  maybeThrowError,
  MockApiError,
  createMockStore,
} from './mock-engine'

beforeEach(() => {
  resetMockApiConfig()
})

describe('mock-engine', () => {
  describe('configureMockApi', () => {
    it('merges overrides into config', () => {
      configureMockApi({ errorRate: 0.5 })
      expect(getMockApiConfig().errorRate).toBe(0.5)
      expect(getMockApiConfig().latency).toEqual({ min: 200, max: 800 })
    })

    it('resetMockApiConfig restores defaults', () => {
      configureMockApi({ errorRate: 1, latency: { min: 0, max: 0 } })
      resetMockApiConfig()
      expect(getMockApiConfig().errorRate).toBe(0)
      expect(getMockApiConfig().latency).toEqual({ min: 200, max: 800 })
    })
  })

  describe('simulateLatency', () => {
    it('resolves instantly with zero latency', async () => {
      configureMockApi({ latency: { min: 0, max: 0 } })
      const start = Date.now()
      await simulateLatency()
      expect(Date.now() - start).toBeLessThan(50)
    })
  })

  describe('maybeThrowError', () => {
    it('does not throw when errorRate is 0', () => {
      configureMockApi({ errorRate: 0 })
      expect(() => maybeThrowError()).not.toThrow()
    })

    it('always throws when errorRate is 1', () => {
      configureMockApi({ errorRate: 1 })
      expect(() => maybeThrowError()).toThrow(MockApiError)
    })

    it('MockApiError has status and name', () => {
      const err = new MockApiError('test', 404)
      expect(err.name).toBe('MockApiError')
      expect(err.status).toBe(404)
      expect(err.message).toBe('test')
    })
  })

  describe('createMockStore', () => {
    interface Item {
      id: string
      name: string
    }

    const seed: Item[] = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Beta' },
    ]
    let store: ReturnType<typeof createMockStore<Item>>

    beforeEach(() => {
      store = createMockStore<Item>(seed)
    })

    it('getAll returns all items', () => {
      expect(store.getAll()).toHaveLength(2)
    })

    it('getAll returns a copy, not reference', () => {
      const items = store.getAll()
      items.pop()
      expect(store.getAll()).toHaveLength(2)
    })

    it('getById returns matching item', () => {
      expect(store.getById('1')?.name).toBe('Alpha')
    })

    it('getById returns undefined for missing id', () => {
      expect(store.getById('999')).toBeUndefined()
    })

    it('create adds an item', () => {
      store.create({ id: '3', name: 'Gamma' })
      expect(store.getAll()).toHaveLength(3)
      expect(store.getById('3')?.name).toBe('Gamma')
    })

    it('update merges partial data', () => {
      const updated = store.update('1', { name: 'AlphaRenamed' })
      expect(updated.name).toBe('AlphaRenamed')
      expect(store.getById('1')?.name).toBe('AlphaRenamed')
    })

    it('update throws for unknown id', () => {
      expect(() => store.update('999', { name: 'X' })).toThrow(MockApiError)
    })

    it('remove deletes an item', () => {
      store.remove('1')
      expect(store.getAll()).toHaveLength(1)
      expect(store.getById('1')).toBeUndefined()
    })

    it('remove throws for unknown id', () => {
      expect(() => store.remove('999')).toThrow(MockApiError)
    })

    it('reset restores original data', () => {
      store.remove('1')
      store.remove('2')
      expect(store.getAll()).toHaveLength(0)
      store.reset()
      expect(store.getAll()).toHaveLength(2)
      expect(store.getById('1')?.name).toBe('Alpha')
    })

    it('reset does not share references with seed', () => {
      store.update('1', { name: 'Changed' })
      store.reset()
      expect(store.getById('1')?.name).toBe('Alpha')
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import {
  fetchAgents,
  fetchAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  agentStore,
} from './agents.api'
import { configureMockApi, resetMockApiConfig } from './mock-engine'

beforeEach(() => {
  resetMockApiConfig()
  configureMockApi({ latency: { min: 0, max: 0 } })
  agentStore.reset()
})

describe('agents.api', () => {
  describe('fetchAgents', () => {
    it('returns paginated response', async () => {
      const result = await fetchAgents()
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
      expect(result.data.length).toBeGreaterThan(0)
      expect(result.data[0]).toMatchObject({ id: expect.any(String), name: expect.any(String) })
    })

    it('paginates correctly', async () => {
      const page1 = await fetchAgents({ page: 1, pageSize: 3 })
      const page2 = await fetchAgents({ page: 2, pageSize: 3 })
      expect(page1.data).toHaveLength(3)
      expect(page2.data).toHaveLength(3)
      expect(page1.data[0]?.id).not.toBe(page2.data[0]?.id)
    })

    it('filters by status', async () => {
      const result = await fetchAgents({ status: 'draft' })
      expect(result.data.length).toBeGreaterThan(0)
      for (const agent of result.data) {
        expect(agent.status).toBe('draft')
      }
    })

    it('filters by search', async () => {
      const result = await fetchAgents({ search: 'Customer' })
      expect(result.data.length).toBeGreaterThan(0)
      for (const agent of result.data) {
        expect(agent.name.toLowerCase()).toContain('customer')
      }
    })

    it('returns empty data for non-matching search', async () => {
      const result = await fetchAgents({ search: 'zzz-no-match-zzz' })
      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('every agent has required fields', async () => {
      const result = await fetchAgents()
      for (const agent of result.data) {
        expect(agent).toHaveProperty('id')
        expect(agent).toHaveProperty('name')
        expect(agent).toHaveProperty('channels')
        expect(agent).toHaveProperty('conversations')
        expect(agent).toHaveProperty('status')
      }
    })
  })

  describe('fetchAgent', () => {
    it('returns agent by id', async () => {
      const agent = await fetchAgent('1')
      expect(agent).not.toBeNull()
      expect(agent?.id).toBe('1')
    })

    it('returns null for unknown id', async () => {
      const agent = await fetchAgent('nonexistent-999')
      expect(agent).toBeNull()
    })
  })

  describe('createAgent', () => {
    it('returns new agent with a generated id', async () => {
      const data = {
        name: 'Test Bot',
        channels: [],
        conversations: 0,
        resolution: null,
        csat: null,
        status: 'draft' as const,
      }
      const agent = await createAgent(data)
      expect(agent.id).toBeDefined()
      expect(agent.name).toBe('Test Bot')
      expect(agent.status).toBe('draft')
    })

    it('persists agent in store', async () => {
      const data = {
        name: 'Persisted Bot',
        channels: [],
        conversations: 0,
        resolution: null,
        csat: null,
        status: 'draft' as const,
      }
      const agent = await createAgent(data)
      const fetched = await fetchAgent(agent.id)
      expect(fetched?.name).toBe('Persisted Bot')
    })
  })

  describe('updateAgent', () => {
    it('merges partial data onto existing agent', async () => {
      const updated = await updateAgent('1', { name: 'Renamed Bot' })
      expect(updated.id).toBe('1')
      expect(updated.name).toBe('Renamed Bot')
    })

    it('persists update in store', async () => {
      await updateAgent('1', { name: 'Renamed Bot' })
      const fetched = await fetchAgent('1')
      expect(fetched?.name).toBe('Renamed Bot')
    })

    it('throws for unknown agent id', async () => {
      await expect(updateAgent('nonexistent-999', { name: 'X' })).rejects.toThrow('nonexistent-999')
    })
  })

  describe('deleteAgent', () => {
    it('resolves without error', async () => {
      await expect(deleteAgent('1')).resolves.toBeUndefined()
    })

    it('removes agent from store', async () => {
      await deleteAgent('1')
      const fetched = await fetchAgent('1')
      expect(fetched).toBeNull()
    })

    it('throws for unknown id', async () => {
      await expect(deleteAgent('nonexistent-999')).rejects.toThrow()
    })
  })
})

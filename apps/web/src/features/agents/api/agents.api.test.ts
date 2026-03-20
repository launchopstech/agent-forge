import { describe, it, expect } from 'vitest'
import { fetchAgents, fetchAgent, createAgent, updateAgent, deleteAgent } from './agents.api'

describe('agents.api', () => {
  describe('fetchAgents', () => {
    it('returns all agents from mock data', async () => {
      const agents = await fetchAgents()
      expect(agents.length).toBeGreaterThan(0)
      expect(agents[0]).toMatchObject({ id: expect.any(String), name: expect.any(String) })
    })

    it('every agent has required fields', async () => {
      const agents = await fetchAgents()
      for (const agent of agents) {
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
  })

  describe('updateAgent', () => {
    it('merges partial data onto existing agent', async () => {
      const updated = await updateAgent('1', { name: 'Renamed Bot' })
      expect(updated.id).toBe('1')
      expect(updated.name).toBe('Renamed Bot')
    })

    it('throws for unknown agent id', async () => {
      await expect(updateAgent('nonexistent-999', { name: 'X' })).rejects.toThrow('nonexistent-999')
    })
  })

  describe('deleteAgent', () => {
    it('resolves without error', async () => {
      await expect(deleteAgent('1')).resolves.toBeUndefined()
    })
  })
})

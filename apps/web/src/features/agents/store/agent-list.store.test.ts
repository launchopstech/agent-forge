import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAgentListStore } from './agent-list.store'
import type { Agent } from '../types'

// Mock the API layer so tests don't depend on mock data files
vi.mock('../api/agents.api', () => ({
  fetchAgents: vi.fn(),
  deleteAgent: vi.fn(),
}))
vi.mock('../api/metrics.api', () => ({
  fetchMetrics: vi.fn(),
  fetchUnresolvedIntents: vi.fn(),
}))

import { fetchAgents, deleteAgent } from '../api/agents.api'
import { fetchMetrics, fetchUnresolvedIntents } from '../api/metrics.api'

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Bot A',
    channels: [],
    conversations: 100,
    resolution: 80,
    csat: 4.5,
    status: 'live',
  },
  {
    id: '2',
    name: 'Bot B',
    channels: [],
    conversations: 50,
    resolution: 70,
    csat: 4.0,
    status: 'draft',
  },
]

const MOCK_METRICS = {
  totalConversations: 150,
  totalConversationsChange: 5,
  resolutionRate: 75,
  resolutionRateChange: 2,
  handoffRate: 10,
  handoffRateChange: -1,
  avgResponseTime: '1.5s',
  avgResponseTimeChange: 0,
}

const MOCK_INTENTS_RESULT = {
  intents: [{ label: 'Refund', percentage: 60, severity: 'high' as const }],
  recommendation: { type: 'warning' as const, message: 'Train more', cta: 'Fix it', agentId: '1' },
}

beforeEach(() => {
  vi.clearAllMocks()
  // Reset store state
  useAgentListStore.setState({
    agents: [],
    metrics: null,
    unresolvedIntents: [],
    recommendation: null,
    isLoading: false,
    error: null,
  })
})

describe('agent-list.store', () => {
  describe('loadAgents', () => {
    it('fetches agents and sets them in state', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_AGENTS)
      await useAgentListStore.getState().loadAgents()
      expect(useAgentListStore.getState().agents).toEqual(MOCK_AGENTS)
      expect(useAgentListStore.getState().isLoading).toBe(false)
    })

    it('sets error on failure', async () => {
      vi.mocked(fetchAgents).mockRejectedValue(new Error('Network error'))
      await useAgentListStore.getState().loadAgents()
      expect(useAgentListStore.getState().error).toBe('Network error')
      expect(useAgentListStore.getState().isLoading).toBe(false)
    })
  })

  describe('loadMetrics', () => {
    it('fetches metrics and intents', async () => {
      vi.mocked(fetchMetrics).mockResolvedValue(MOCK_METRICS)
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
      await useAgentListStore.getState().loadMetrics()
      const state = useAgentListStore.getState()
      expect(state.metrics).toEqual(MOCK_METRICS)
      expect(state.unresolvedIntents).toHaveLength(1)
      expect(state.recommendation?.cta).toBe('Fix it')
    })

    it('sets error on failure', async () => {
      vi.mocked(fetchMetrics).mockRejectedValue(new Error('Metrics unavailable'))
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
      await useAgentListStore.getState().loadMetrics()
      expect(useAgentListStore.getState().error).toBe('Metrics unavailable')
    })
  })

  describe('loadAll', () => {
    it('loads agents, metrics, and intents concurrently', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_AGENTS)
      vi.mocked(fetchMetrics).mockResolvedValue(MOCK_METRICS)
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
      await useAgentListStore.getState().loadAll()
      const state = useAgentListStore.getState()
      expect(state.agents).toHaveLength(2)
      expect(state.metrics?.totalConversations).toBe(150)
      expect(state.unresolvedIntents).toHaveLength(1)
      expect(state.isLoading).toBe(false)
    })
  })

  describe('removeAgent', () => {
    it('removes agent optimistically before API resolves', async () => {
      useAgentListStore.setState({ agents: MOCK_AGENTS })
      vi.mocked(deleteAgent).mockResolvedValue(undefined)

      const promise = useAgentListStore.getState().removeAgent('1')
      // Optimistic update is synchronous
      expect(useAgentListStore.getState().agents.find((a) => a.id === '1')).toBeUndefined()
      await promise
    })

    it('calls deleteAgent with the correct id', async () => {
      useAgentListStore.setState({ agents: MOCK_AGENTS })
      vi.mocked(deleteAgent).mockResolvedValue(undefined)
      await useAgentListStore.getState().removeAgent('2')
      expect(deleteAgent).toHaveBeenCalledWith('2')
    })

    it('rolls back by reloading agents when API fails', async () => {
      useAgentListStore.setState({ agents: MOCK_AGENTS })
      vi.mocked(deleteAgent).mockRejectedValue(new Error('Delete failed'))
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_AGENTS)

      await useAgentListStore.getState().removeAgent('1')

      // Should have re-fetched and restored agents
      expect(fetchAgents).toHaveBeenCalled()
      expect(useAgentListStore.getState().agents).toEqual(MOCK_AGENTS)
      expect(useAgentListStore.getState().error).toBe('Delete failed')
    })
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }))
import { useAgentListStore } from './agent-list.store'
import type { Agent } from '../types'

// Mock the API layer so tests don't depend on mock data files
vi.mock('../api/agents.api', () => ({
  fetchAgents: vi.fn(),
  createAgent: vi.fn(),
  deleteAgent: vi.fn(),
}))
vi.mock('../api/metrics.api', () => ({
  EMPTY_DASHBOARD_METRICS: {
    totalAgents: null,
    activeAgents: null,
    totalMessages: null,
    period: 'all-time',
  },
  fetchMetrics: vi.fn(),
  fetchUnresolvedIntents: vi.fn(),
}))

import { fetchAgents, createAgent as apiCreateAgent, deleteAgent } from '../api/agents.api'
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

const MOCK_PAGINATED = {
  data: MOCK_AGENTS,
  total: 2,
  page: 1,
  pageSize: 10,
}

const MOCK_METRICS = {
  totalAgents: 2,
  activeAgents: 1,
  totalMessages: 7,
  period: 'all-time' as const,
}

const MOCK_INTENTS_RESULT = {
  intents: [{ label: 'Refund', percentage: 60, severity: 'high' as const }],
  recommendation: { type: 'warning' as const, message: 'Train more', cta: 'Fix it', agentId: '1' },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
  vi.mocked(fetchMetrics).mockResolvedValue(MOCK_METRICS)
  vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
  // Reset store state
  useAgentListStore.setState({
    agents: [],
    metrics: null,
    unresolvedIntents: [],
    recommendation: null,
    isLoading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
    search: '',
    statusFilter: null,
  })
})

describe('agent-list.store', () => {
  describe('loadAgents', () => {
    it('fetches agents and sets them in state', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      await useAgentListStore.getState().loadAgents()
      expect(useAgentListStore.getState().agents).toEqual(MOCK_AGENTS)
      expect(useAgentListStore.getState().total).toBe(2)
      expect(useAgentListStore.getState().isLoading).toBe(false)
    })

    it('passes pagination params to API', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      useAgentListStore.setState({ page: 2, pageSize: 5, search: 'Bot', statusFilter: 'live' })
      await useAgentListStore.getState().loadAgents()
      expect(fetchAgents).toHaveBeenCalledWith({
        page: 2,
        pageSize: 5,
        search: 'Bot',
        status: 'live',
      })
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

    it('uses placeholder metrics without setting a dashboard error when metrics fail', async () => {
      vi.mocked(fetchMetrics).mockRejectedValue(new Error('Metrics unavailable'))
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
      await useAgentListStore.getState().loadMetrics()
      const state = useAgentListStore.getState()
      expect(state.metrics).toEqual({
        totalAgents: null,
        activeAgents: null,
        totalMessages: null,
        period: 'all-time',
      })
      expect(state.unresolvedIntents).toHaveLength(1)
      expect(state.error).toBeNull()
    })
  })

  describe('loadAll', () => {
    it('loads agents, metrics, and intents concurrently', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      vi.mocked(fetchMetrics).mockResolvedValue(MOCK_METRICS)
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)
      await useAgentListStore.getState().loadAll()
      const state = useAgentListStore.getState()
      expect(state.agents).toHaveLength(2)
      expect(state.total).toBe(2)
      expect(state.metrics?.totalAgents).toBe(2)
      expect(state.unresolvedIntents).toHaveLength(1)
      expect(state.isLoading).toBe(false)
    })

    it('keeps agent data visible when metrics fail', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      vi.mocked(fetchMetrics).mockRejectedValue(new Error('Metrics unavailable'))
      vi.mocked(fetchUnresolvedIntents).mockResolvedValue(MOCK_INTENTS_RESULT)

      await useAgentListStore.getState().loadAll()

      const state = useAgentListStore.getState()
      expect(state.agents).toHaveLength(2)
      expect(state.metrics).toEqual({
        totalAgents: null,
        activeAgents: null,
        totalMessages: null,
        period: 'all-time',
      })
      expect(state.error).toBeNull()
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

    it('refreshes metrics after successful delete', async () => {
      useAgentListStore.setState({ agents: MOCK_AGENTS })
      vi.mocked(deleteAgent).mockResolvedValue(undefined)

      await useAgentListStore.getState().removeAgent('1')

      expect(fetchMetrics).toHaveBeenCalled()
      expect(useAgentListStore.getState().metrics).toEqual(MOCK_METRICS)
    })

    it('rolls back by reloading agents when API fails', async () => {
      useAgentListStore.setState({ agents: MOCK_AGENTS })
      vi.mocked(deleteAgent).mockRejectedValue(new Error('Delete failed'))
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)

      await useAgentListStore.getState().removeAgent('1')

      // Should have re-fetched and restored agents
      expect(fetchAgents).toHaveBeenCalled()
      expect(fetchMetrics).not.toHaveBeenCalled()
      expect(useAgentListStore.getState().agents).toEqual(MOCK_AGENTS)
      expect(useAgentListStore.getState().error).toBe('Delete failed')
    })
  })

  describe('setSearch', () => {
    it('resets page to 1 and triggers reload', async () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      useAgentListStore.setState({ page: 3 })
      useAgentListStore.getState().setSearch('test')
      expect(useAgentListStore.getState().search).toBe('test')
      expect(useAgentListStore.getState().page).toBe(1)
    })
  })

  describe('setStatusFilter', () => {
    it('resets page to 1', () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      useAgentListStore.setState({ page: 5 })
      useAgentListStore.getState().setStatusFilter('live')
      expect(useAgentListStore.getState().statusFilter).toBe('live')
      expect(useAgentListStore.getState().page).toBe(1)
    })

    it('accepts null to clear filter', () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      useAgentListStore.getState().setStatusFilter(null)
      expect(useAgentListStore.getState().statusFilter).toBeNull()
    })
  })

  describe('setPage', () => {
    it('sets page and triggers reload', () => {
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      useAgentListStore.getState().setPage(2)
      expect(useAgentListStore.getState().page).toBe(2)
      expect(fetchAgents).toHaveBeenCalled()
    })
  })

  describe('createAgent', () => {
    it('calls createAgent API with the provided data', async () => {
      vi.mocked(apiCreateAgent).mockResolvedValue(MOCK_AGENTS[0]!)
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      const data = { name: 'New Bot' }
      await useAgentListStore.getState().createAgent(data)
      expect(apiCreateAgent).toHaveBeenCalledWith(data)
    })

    it('reloads agent list after successful create', async () => {
      vi.mocked(apiCreateAgent).mockResolvedValue(MOCK_AGENTS[0]!)
      vi.mocked(fetchAgents).mockResolvedValue(MOCK_PAGINATED)
      const data = { name: 'New Bot' }
      await useAgentListStore.getState().createAgent(data)
      expect(fetchAgents).toHaveBeenCalled()
    })

    it('refreshes metrics after successful create', async () => {
      vi.mocked(apiCreateAgent).mockResolvedValue(MOCK_AGENTS[0]!)
      const data = { name: 'New Bot' }

      await useAgentListStore.getState().createAgent(data)

      expect(fetchMetrics).toHaveBeenCalled()
      expect(useAgentListStore.getState().metrics).toEqual(MOCK_METRICS)
    })

    it('sets error state on API failure', async () => {
      vi.mocked(apiCreateAgent).mockRejectedValue(new Error('Create failed'))
      const data = { name: 'Bad Bot' }
      await useAgentListStore.getState().createAgent(data)
      expect(useAgentListStore.getState().error).toBe('Create failed')
    })
  })
})

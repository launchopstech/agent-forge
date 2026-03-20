import { create } from 'zustand'
import type { Agent, DashboardMetrics, UnresolvedIntent, Recommendation } from '../types'
import { fetchAgents, deleteAgent } from '../api/agents.api'
import { fetchMetrics, fetchUnresolvedIntents } from '../api/metrics.api'

interface AgentListState {
  agents: Agent[]
  metrics: DashboardMetrics | null
  unresolvedIntents: UnresolvedIntent[]
  recommendation: Recommendation | null
  isLoading: boolean
  error: string | null
  loadAgents: () => Promise<void>
  loadMetrics: () => Promise<void>
  loadAll: () => Promise<void>
  removeAgent: (id: string) => Promise<void>
}

export const useAgentListStore = create<AgentListState>((set) => ({
  agents: [],
  metrics: null,
  unresolvedIntents: [],
  recommendation: null,
  isLoading: false,
  error: null,

  loadAgents: async () => {
    set({ isLoading: true, error: null })
    try {
      const agents = await fetchAgents()
      set({ agents, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load agents' })
    }
  },

  loadMetrics: async () => {
    try {
      const [metrics, { intents, recommendation }] = await Promise.all([
        fetchMetrics(),
        fetchUnresolvedIntents(),
      ])
      set({ metrics, unresolvedIntents: intents, recommendation })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load metrics' })
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const [agents, metrics, { intents, recommendation }] = await Promise.all([
        fetchAgents(),
        fetchMetrics(),
        fetchUnresolvedIntents(),
      ])
      set({ agents, metrics, unresolvedIntents: intents, recommendation, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load data' })
    }
  },

  removeAgent: async (id: string) => {
    // Optimistic update
    set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }))
    try {
      await deleteAgent(id)
    } catch (err) {
      // Rollback on failure by reloading from source
      const agents = await fetchAgents()
      set({ agents, error: err instanceof Error ? err.message : 'Failed to delete agent' })
    }
  },
}))

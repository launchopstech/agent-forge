import { create } from 'zustand'
import type {
  Agent,
  AgentStatus,
  DashboardMetrics,
  UnresolvedIntent,
  Recommendation,
} from '../types'
import {
  fetchAgents,
  createAgent as apiCreateAgent,
  deleteAgent,
  type CreateAgentPayload,
} from '../api/agents.api'
import { fetchMetrics, fetchUnresolvedIntents } from '../api/metrics.api'
import { toast } from '@/hooks/use-toast'

interface AgentListState {
  agents: Agent[]
  metrics: DashboardMetrics | null
  unresolvedIntents: UnresolvedIntent[]
  recommendation: Recommendation | null
  isLoading: boolean
  error: string | null

  // Pagination & filtering
  page: number
  pageSize: number
  total: number
  search: string
  statusFilter: AgentStatus | null

  // Actions
  loadAgents: () => Promise<void>
  loadMetrics: () => Promise<void>
  loadAll: () => Promise<void>
  createAgent: (data: CreateAgentPayload) => Promise<void>
  removeAgent: (id: string) => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  setStatusFilter: (status: AgentStatus | null) => void
}

export const useAgentListStore = create<AgentListState>((set, get) => ({
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

  loadAgents: async () => {
    const { page, pageSize, search, statusFilter } = get()
    set({ error: null })
    try {
      const result = await fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
      })
      set({ agents: result.data, total: result.total })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load agents' })
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
    const { page, pageSize, search, statusFilter } = get()
    set({ isLoading: true, error: null })
    try {
      const [agentsResult, metrics, { intents, recommendation }] = await Promise.all([
        fetchAgents({
          page,
          pageSize,
          search: search || undefined,
          status: statusFilter ?? undefined,
        }),
        fetchMetrics(),
        fetchUnresolvedIntents(),
      ])
      set({
        agents: agentsResult.data,
        total: agentsResult.total,
        metrics,
        unresolvedIntents: intents,
        recommendation,
        isLoading: false,
      })
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load data' })
    }
  },

  createAgent: async (data: CreateAgentPayload) => {
    try {
      await apiCreateAgent(data)
      await get().loadAgents()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create agent'
      set({ error: message })
      toast({ title: 'Error', description: message, variant: 'destructive' })
    }
  },

  removeAgent: async (id: string) => {
    set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }))
    try {
      await deleteAgent(id)
    } catch (err) {
      // Rollback on failure by reloading
      const { page, pageSize, search, statusFilter } = get()
      const result = await fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
      })
      const message = err instanceof Error ? err.message : 'Failed to delete agent'
      set({ agents: result.data, total: result.total, error: message })
      toast({ title: 'Error', description: message, variant: 'destructive' })
    }
  },

  setPage: (page) => {
    set({ page })
    void get().loadAgents()
  },

  setSearch: (search) => {
    set({ search, page: 1 })
    void get().loadAgents()
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, page: 1 })
    void get().loadAgents()
  },
}))

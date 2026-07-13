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
import { EMPTY_DASHBOARD_METRICS, fetchMetrics, fetchUnresolvedIntents } from '../api/metrics.api'
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
  agentTypeFilter: string | null

  // Actions
  loadAgents: () => Promise<void>
  loadMetrics: () => Promise<void>
  loadAll: () => Promise<void>
  refreshDashboardData: () => Promise<void>
  createAgent: (data: CreateAgentPayload) => Promise<void>
  removeAgent: (id: string) => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  setStatusFilter: (status: AgentStatus | null) => void
  setAgentTypeFilter: (agentType: string | null) => void
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
  agentTypeFilter: null,

  loadAgents: async () => {
    const { page, pageSize, search, statusFilter, agentTypeFilter } = get()
    set({ error: null })
    try {
      const result = await fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
        agentType: agentTypeFilter ?? undefined,
      })
      set({ agents: result.data, total: result.total })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load agents' })
    }
  },

  loadMetrics: async () => {
    const [metricsResult, intentsResult] = await Promise.allSettled([
      fetchMetrics(),
      fetchUnresolvedIntents(),
    ])

    set({
      metrics: metricsResult.status === 'fulfilled' ? metricsResult.value : EMPTY_DASHBOARD_METRICS,
      ...(intentsResult.status === 'fulfilled'
        ? {
            unresolvedIntents: intentsResult.value.intents,
            recommendation: intentsResult.value.recommendation,
          }
        : {
            error:
              intentsResult.reason instanceof Error
                ? intentsResult.reason.message
                : 'Failed to load metrics',
          }),
    })
  },

  loadAll: async () => {
    const { page, pageSize, search, statusFilter, agentTypeFilter } = get()
    set({ isLoading: true, error: null })

    const [agentsResult, metricsResult, intentsResult] = await Promise.allSettled([
      fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
        agentType: agentTypeFilter ?? undefined,
      }),
      fetchMetrics(),
      fetchUnresolvedIntents(),
    ])

    if (agentsResult.status === 'rejected') {
      set({
        isLoading: false,
        metrics:
          metricsResult.status === 'fulfilled' ? metricsResult.value : EMPTY_DASHBOARD_METRICS,
        error:
          agentsResult.reason instanceof Error
            ? agentsResult.reason.message
            : 'Failed to load data',
      })
      return
    }

    set({
      agents: agentsResult.value.data,
      total: agentsResult.value.total,
      metrics: metricsResult.status === 'fulfilled' ? metricsResult.value : EMPTY_DASHBOARD_METRICS,
      ...(intentsResult.status === 'fulfilled'
        ? {
            unresolvedIntents: intentsResult.value.intents,
            recommendation: intentsResult.value.recommendation,
          }
        : {}),
      isLoading: false,
    })
  },

  refreshDashboardData: async () => {
    const { page, pageSize, search, statusFilter, agentTypeFilter } = get()
    const [agentsResult, metricsResult] = await Promise.allSettled([
      fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
        agentType: agentTypeFilter ?? undefined,
      }),
      fetchMetrics(),
    ])

    set({
      ...(agentsResult.status === 'fulfilled'
        ? {
            agents: agentsResult.value.data,
            total: agentsResult.value.total,
            error: null,
          }
        : {
            error:
              agentsResult.reason instanceof Error
                ? agentsResult.reason.message
                : 'Failed to refresh agents',
          }),
      metrics: metricsResult.status === 'fulfilled' ? metricsResult.value : EMPTY_DASHBOARD_METRICS,
    })
  },

  createAgent: async (data: CreateAgentPayload) => {
    try {
      await apiCreateAgent(data)
      await get().refreshDashboardData()
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
      await get().refreshDashboardData()
    } catch (err) {
      // Rollback on failure by reloading
      const { page, pageSize, search, statusFilter, agentTypeFilter } = get()
      const result = await fetchAgents({
        page,
        pageSize,
        search: search || undefined,
        status: statusFilter ?? undefined,
        agentType: agentTypeFilter ?? undefined,
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

  setAgentTypeFilter: (agentType) => {
    set({ agentTypeFilter: agentType, page: 1 })
    void get().loadAgents()
  },
}))

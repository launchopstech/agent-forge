import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import type { Agent, AgentListParams, AgentStatus, PaginatedResponse } from '../types'

function redirect401(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 401) {
    window.location.href = '/login'
    return true
  }
  return false
}

export async function fetchAgents(params?: AgentListParams): Promise<PaginatedResponse<Agent>> {
  const { page = 1, pageSize = 10, search, status } = params ?? {}
  let agents: Agent[]
  try {
    agents = await apiClient.get<Agent[]>('/api/agents', { getToken: getAccessToken })
  } catch (err) {
    if (redirect401(err)) return { data: [], total: 0, page, pageSize }
    throw err
  }

  if (status) {
    agents = agents.filter((a) => a.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    agents = agents.filter((a) => a.name.toLowerCase().includes(q))
  }

  const total = agents.length
  const start = (page - 1) * pageSize
  const data = agents.slice(start, start + pageSize)

  return { data, total, page, pageSize }
}

/** Raw row returned by GET /api/agents/:id */
interface AgentRow {
  id: string
  name: string
  status: string
  uiConfig?: { channels?: string[] } | null
}

export async function fetchAgent(id: string): Promise<Agent | null> {
  try {
    const row = await apiClient.get<AgentRow>(`/api/agents/${id}`, { getToken: getAccessToken })
    return {
      id: row.id,
      name: row.name,
      status: row.status as Agent['status'],
      channels: (row.uiConfig?.channels ?? []) as Agent['channels'],
      conversations: 0,
      resolution: null,
      csat: null,
    }
  } catch (err) {
    if (redirect401(err)) return null
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

/** Payload accepted by POST /api/agents */
export interface CreateAgentPayload {
  name: string
  templateId?: string
  uiConfig?: Record<string, unknown>
  aiConfig?: Record<string, unknown>
}

export async function createAgent(data: CreateAgentPayload): Promise<Agent> {
  try {
    return await apiClient.post<Agent>('/api/agents', data, { getToken: getAccessToken })
  } catch (err) {
    if (redirect401(err)) return {} as Agent
    throw err
  }
}

/** Payload accepted by PATCH /api/agents/:id */
export interface UpdateAgentPayload {
  name?: string
  templateId?: string
  uiConfig?: Record<string, unknown>
  aiConfig?: Record<string, unknown>
}

export async function updateAgent(id: string, data: UpdateAgentPayload): Promise<Agent> {
  try {
    return await apiClient.patch<Agent>(`/api/agents/${id}`, data, { getToken: getAccessToken })
  } catch (err) {
    if (redirect401(err)) return {} as Agent
    throw err
  }
}

export async function deleteAgent(id: string): Promise<void> {
  try {
    await apiClient.delete<void>(`/api/agents/${id}`, { getToken: getAccessToken })
  } catch (err) {
    if (redirect401(err)) return
    throw err
  }
}

export async function publishAgent(id: string): Promise<Agent> {
  try {
    return await apiClient.patch<Agent>(
      `/api/agents/${id}/status`,
      { status: 'live' satisfies AgentStatus },
      { getToken: getAccessToken }
    )
  } catch (err) {
    if (redirect401(err)) return {} as Agent
    throw err
  }
}

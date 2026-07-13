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
  const { page = 1, pageSize = 10, search, status, agentType } = params ?? {}
  const searchParams = new URLSearchParams()
  if (search) searchParams.set('search', search)
  if (status) searchParams.set('status', status)
  if (agentType) searchParams.set('agentType', agentType)
  const query = searchParams.toString()
  let agents: Agent[]
  try {
    const rows = await apiClient.get<AgentRow[]>(`/api/agents${query ? `?${query}` : ''}`, {
      getToken: getAccessToken,
      cache: 'no-store',
    })
    agents = rows.map(mapAgentRow)
  } catch (err) {
    if (redirect401(err)) return { data: [], total: 0, page, pageSize }
    throw err
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
  agentType?: string
  agentTypeSlug?: string
  shareToken?: string | null
  uiConfig?: { channels?: string[] } | null
  channels?: Agent['channels']
  conversations?: number
  resolution?: number | null
  csat?: number | null
}

function mapAgentRow(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    agentType: row.agentType ?? row.agentTypeSlug ?? 'custom',
    status: row.status as Agent['status'],
    channels: (row.channels ?? row.uiConfig?.channels ?? []) as Agent['channels'],
    conversations: row.conversations ?? 0,
    resolution: row.resolution ?? null,
    csat: row.csat ?? null,
    shareToken: row.shareToken ?? null,
  }
}

export async function fetchAgent(id: string): Promise<Agent | null> {
  try {
    const row = await apiClient.get<AgentRow>(`/api/agents/${id}`, {
      getToken: getAccessToken,
      cache: 'no-store',
    })
    return mapAgentRow(row)
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
  agentType?: string
  uiConfig?: Record<string, unknown>
  aiConfig?: Record<string, unknown>
  knowledgeSourceSlugs?: string[]
}

export async function createAgent(data: CreateAgentPayload): Promise<Agent> {
  try {
    const row = await apiClient.post<AgentRow>('/api/agents', data, { getToken: getAccessToken })
    return mapAgentRow(row)
  } catch (err) {
    if (redirect401(err)) return {} as Agent
    throw err
  }
}

/** Payload accepted by PATCH /api/agents/:id */
export interface UpdateAgentPayload {
  name?: string
  templateId?: string
  agentType?: string
  uiConfig?: Record<string, unknown>
  aiConfig?: Record<string, unknown>
}

export async function updateAgent(id: string, data: UpdateAgentPayload): Promise<Agent> {
  try {
    const row = await apiClient.patch<AgentRow>(`/api/agents/${id}`, data, {
      getToken: getAccessToken,
    })
    return mapAgentRow(row)
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

export async function updateAgentStatus(id: string, status: AgentStatus): Promise<Agent> {
  try {
    const row = await apiClient.patch<AgentRow>(
      `/api/agents/${id}/status`,
      { status },
      { getToken: getAccessToken }
    )
    return mapAgentRow(row)
  } catch (err) {
    if (redirect401(err)) return {} as Agent
    throw err
  }
}

export function publishAgent(id: string): Promise<Agent> {
  return updateAgentStatus(id, 'live')
}

export function pauseAgent(id: string): Promise<Agent> {
  return updateAgentStatus(id, 'paused')
}

export function resumeAgent(id: string): Promise<Agent> {
  return updateAgentStatus(id, 'live')
}

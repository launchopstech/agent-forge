import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import type { KnowledgeSourceOption } from '../types'

export type KnowledgeItemType = 'qa' | 'document' | 'shopify_product'

export interface KnowledgeItem {
  id: string
  type: KnowledgeItemType
  title?: string | null
  question?: string | null
  answer?: string | null
  content?: string | null
  sourceUrl?: string | null
  knowledgeSourceOptionId?: string | null
  position: number
}

export type CreateKnowledgeItemPayload = Omit<KnowledgeItem, 'id'>
export type UpdateKnowledgeItemPayload = Partial<Omit<KnowledgeItem, 'id'>>

function redirect401(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 401) {
    window.location.href = '/login'
    return true
  }
  return false
}

export async function fetchKnowledgeItems(agentId: string): Promise<KnowledgeItem[]> {
  try {
    return await apiClient.get<KnowledgeItem[]>(`/api/agents/${agentId}/knowledge`, {
      getToken: getAccessToken,
      cache: 'no-store',
    })
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function fetchKnowledgeSourceOptions(
  agentType?: string
): Promise<KnowledgeSourceOption[]> {
  const searchParams = new URLSearchParams()
  if (agentType) searchParams.set('agentType', agentType)
  const query = searchParams.toString()

  try {
    return await apiClient.get<KnowledgeSourceOption[]>(
      `/api/knowledge-source-options${query ? `?${query}` : ''}`,
      {
        getToken: getAccessToken,
        cache: 'no-store',
      }
    )
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function fetchAgentTypeKnowledgeSources(
  agentType: string
): Promise<KnowledgeSourceOption[]> {
  try {
    return await apiClient.get<KnowledgeSourceOption[]>(
      `/api/agent-types/${agentType}/knowledge-sources`,
      {
        getToken: getAccessToken,
        cache: 'no-store',
      }
    )
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function updateAgentTypeKnowledgeSources(
  agentType: string,
  sourceSlugs: string[]
): Promise<KnowledgeSourceOption[]> {
  try {
    return await apiClient.put<KnowledgeSourceOption[]>(
      `/api/agent-types/${agentType}/knowledge-sources`,
      { sourceSlugs },
      { getToken: getAccessToken }
    )
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function fetchAgentKnowledgeSources(
  agentId: string
): Promise<KnowledgeSourceOption[]> {
  try {
    return await apiClient.get<KnowledgeSourceOption[]>(
      `/api/agents/${agentId}/knowledge-sources`,
      {
        getToken: getAccessToken,
        cache: 'no-store',
      }
    )
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function updateAgentKnowledgeSources(
  agentId: string,
  sourceSlugs: string[]
): Promise<KnowledgeSourceOption[]> {
  try {
    return await apiClient.put<KnowledgeSourceOption[]>(
      `/api/agents/${agentId}/knowledge-sources`,
      { sourceSlugs },
      { getToken: getAccessToken }
    )
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function createKnowledgeItem(
  agentId: string,
  dto: CreateKnowledgeItemPayload
): Promise<KnowledgeItem> {
  try {
    return await apiClient.post<KnowledgeItem>(`/api/agents/${agentId}/knowledge`, dto, {
      getToken: getAccessToken,
    })
  } catch (err) {
    if (redirect401(err)) return {} as KnowledgeItem
    throw err
  }
}

export async function updateKnowledgeItem(
  agentId: string,
  itemId: string,
  dto: UpdateKnowledgeItemPayload
): Promise<KnowledgeItem> {
  try {
    return await apiClient.put<KnowledgeItem>(`/api/agents/${agentId}/knowledge/${itemId}`, dto, {
      getToken: getAccessToken,
    })
  } catch (err) {
    if (redirect401(err)) return {} as KnowledgeItem
    throw err
  }
}

export async function deleteKnowledgeItem(agentId: string, itemId: string): Promise<void> {
  try {
    await apiClient.delete<void>(`/api/agents/${agentId}/knowledge/${itemId}`, {
      getToken: getAccessToken,
    })
  } catch (err) {
    if (redirect401(err)) return
    throw err
  }
}

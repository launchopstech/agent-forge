import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import type { AgentTemplate } from '../types'

function redirect401(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 401) {
    window.location.href = '/login'
    return true
  }
  return false
}

export async function fetchTemplates(category?: string): Promise<AgentTemplate[]> {
  const searchParams = new URLSearchParams()
  if (category && category !== 'all') searchParams.set('category', category)
  const query = searchParams.toString()

  try {
    return await apiClient.get<AgentTemplate[]>(`/api/agent-templates${query ? `?${query}` : ''}`, {
      getToken: getAccessToken,
      cache: 'no-store',
    })
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

export async function fetchTemplate(id: string): Promise<AgentTemplate | null> {
  try {
    return await apiClient.get<AgentTemplate>(`/api/agent-templates/${id}`, {
      getToken: getAccessToken,
      cache: 'no-store',
    })
  } catch (err) {
    if (redirect401(err)) return null
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

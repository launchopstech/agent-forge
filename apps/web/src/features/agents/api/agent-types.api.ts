import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import type { AgentType } from '../types'

function redirect401(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 401) {
    window.location.href = '/login'
    return true
  }
  return false
}

export async function fetchAgentTypes(): Promise<AgentType[]> {
  try {
    return await apiClient.get<AgentType[]>('/api/agent-types', {
      getToken: getAccessToken,
      cache: 'no-store',
    })
  } catch (err) {
    if (redirect401(err)) return []
    throw err
  }
}

import type { DashboardMetrics, UnresolvedIntent, Recommendation } from '../types'
import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import metricsMock from '../mocks/metrics.json'

export const EMPTY_DASHBOARD_METRICS: DashboardMetrics = {
  totalAgents: null,
  activeAgents: null,
  totalMessages: null,
  period: 'all-time',
}

export async function fetchMetrics(): Promise<DashboardMetrics> {
  try {
    return await apiClient.get<DashboardMetrics>('/api/metrics', {
      getToken: getAccessToken,
      cache: 'no-store',
    })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      window.location.href = '/login'
      return EMPTY_DASHBOARD_METRICS
    }
    throw err
  }
}

export async function fetchUnresolvedIntents(): Promise<{
  intents: UnresolvedIntent[]
  recommendation: Recommendation
}> {
  return {
    intents: metricsMock.unresolvedIntents as UnresolvedIntent[],
    recommendation: metricsMock.recommendation as Recommendation,
  }
}

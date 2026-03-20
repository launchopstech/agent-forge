import type { DashboardMetrics, UnresolvedIntent, Recommendation } from '../types'
import metricsMock from '../mocks/metrics.json'

// TODO: Replace mock data with real API calls using apiClient from @forge/api-client

export async function fetchMetrics(): Promise<DashboardMetrics> {
  // TODO: return apiClient.get<DashboardMetrics>('/api/agent-metrics')
  return Promise.resolve(metricsMock.metrics as DashboardMetrics)
}

export async function fetchUnresolvedIntents(): Promise<{
  intents: UnresolvedIntent[]
  recommendation: Recommendation
}> {
  // TODO: return apiClient.get<{ intents: UnresolvedIntent[]; recommendation: Recommendation }>('/api/agent-metrics/intents')
  return Promise.resolve({
    intents: metricsMock.unresolvedIntents as UnresolvedIntent[],
    recommendation: metricsMock.recommendation as Recommendation,
  })
}

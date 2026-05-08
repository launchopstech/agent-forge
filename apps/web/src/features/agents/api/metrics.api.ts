import type { DashboardMetrics, UnresolvedIntent, Recommendation } from '../types'
import metricsMock from '../mocks/metrics.json'

// Metrics endpoint not yet implemented in forge-core — stub with static mock data.
// TODO(spec-06): replace with real apiClient.get('/api/metrics') calls.

export async function fetchMetrics(): Promise<DashboardMetrics> {
  return metricsMock.metrics as DashboardMetrics
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

import type { DashboardMetrics, UnresolvedIntent, Recommendation } from '../types'
import metricsMock from '../mocks/metrics.json'
import { simulateLatency, maybeThrowError } from './mock-engine'

// TODO: Replace mock data with real API calls using apiClient from @forge/api-client

export async function fetchMetrics(): Promise<DashboardMetrics> {
  await simulateLatency()
  maybeThrowError()
  return metricsMock.metrics as DashboardMetrics
}

export async function fetchUnresolvedIntents(): Promise<{
  intents: UnresolvedIntent[]
  recommendation: Recommendation
}> {
  await simulateLatency()
  maybeThrowError()
  return {
    intents: metricsMock.unresolvedIntents as UnresolvedIntent[],
    recommendation: metricsMock.recommendation as Recommendation,
  }
}

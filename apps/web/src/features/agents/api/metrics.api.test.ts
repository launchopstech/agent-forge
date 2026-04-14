import { describe, it, expect, beforeEach } from 'vitest'
import { fetchMetrics, fetchUnresolvedIntents } from './metrics.api'
import { configureMockApi, resetMockApiConfig } from './mock-engine'

beforeEach(() => {
  resetMockApiConfig()
  configureMockApi({ latency: { min: 0, max: 0 } })
})

describe('metrics.api', () => {
  describe('fetchMetrics', () => {
    it('returns dashboard metrics', async () => {
      const metrics = await fetchMetrics()
      expect(metrics.totalConversations).toBeGreaterThan(0)
      expect(metrics.resolutionRate).toBeGreaterThanOrEqual(0)
      expect(metrics.handoffRate).toBeGreaterThanOrEqual(0)
      expect(typeof metrics.avgResponseTime).toBe('string')
    })

    it('includes change fields', async () => {
      const metrics = await fetchMetrics()
      expect(typeof metrics.totalConversationsChange).toBe('number')
      expect(typeof metrics.resolutionRateChange).toBe('number')
      expect(typeof metrics.handoffRateChange).toBe('number')
      expect(typeof metrics.avgResponseTimeChange).toBe('number')
    })
  })

  describe('fetchUnresolvedIntents', () => {
    it('returns intents array and recommendation', async () => {
      const { intents, recommendation } = await fetchUnresolvedIntents()
      expect(Array.isArray(intents)).toBe(true)
      expect(intents.length).toBeGreaterThan(0)
      expect(recommendation).not.toBeNull()
    })

    it('each intent has label, percentage, and severity', async () => {
      const { intents } = await fetchUnresolvedIntents()
      for (const intent of intents) {
        expect(intent).toHaveProperty('label')
        expect(intent.percentage).toBeGreaterThanOrEqual(0)
        expect(['high', 'medium', 'low']).toContain(intent.severity)
      }
    })

    it('recommendation has required fields', async () => {
      const { recommendation } = await fetchUnresolvedIntents()
      expect(recommendation).toHaveProperty('message')
      expect(recommendation).toHaveProperty('cta')
      expect(recommendation).toHaveProperty('agentId')
    })
  })
})

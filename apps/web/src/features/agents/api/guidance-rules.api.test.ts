import { describe, it, expect, beforeEach } from 'vitest'
import {
  fetchGuidanceRules,
  createGuidanceRule,
  updateGuidanceRule,
  deleteGuidanceRule,
  fetchGuidanceRule,
  guidanceRuleStore,
} from './guidance-rules.api'
import { configureMockApi, resetMockApiConfig } from './mock-engine'

beforeEach(() => {
  resetMockApiConfig()
  configureMockApi({ latency: { min: 0, max: 0 } })
  guidanceRuleStore.reset()
})

describe('guidance-rules.api', () => {
  describe('fetchGuidanceRules', () => {
    it('returns all seed rules', async () => {
      const rules = await fetchGuidanceRules()
      expect(rules.length).toBe(3)
    })

    it('each rule has required fields', async () => {
      const rules = await fetchGuidanceRules()
      for (const rule of rules) {
        expect(rule).toHaveProperty('id')
        expect(rule).toHaveProperty('name')
        expect(rule).toHaveProperty('category')
        expect(rule).toHaveProperty('whenCondition')
        expect(rule).toHaveProperty('instructions')
        expect(typeof rule.enabled).toBe('boolean')
        expect(rule).toHaveProperty('createdAt')
        expect(rule).toHaveProperty('updatedAt')
      }
    })
  })

  describe('fetchGuidanceRule', () => {
    it('returns a rule by id', async () => {
      const rules = await fetchGuidanceRules()
      const first = rules[0]!
      const fetched = await fetchGuidanceRule(first.id)
      expect(fetched).not.toBeNull()
      expect(fetched?.id).toBe(first.id)
    })

    it('returns null for unknown id', async () => {
      const result = await fetchGuidanceRule('does-not-exist')
      expect(result).toBeNull()
    })
  })

  describe('createGuidanceRule', () => {
    it('returns a rule with id and timestamps', async () => {
      const rule = await createGuidanceRule({
        name: 'Test Rule',
        category: 'communication',
        whenCondition: 'When user asks',
        instructions: 'Do something',
        enabled: true,
      })
      expect(rule.id).toBeDefined()
      expect(rule.name).toBe('Test Rule')
      expect(rule.createdAt).toBeDefined()
      expect(rule.updatedAt).toBeDefined()
    })

    it('adds the rule to the store', async () => {
      const before = await fetchGuidanceRules()
      await createGuidanceRule({
        name: 'New Rule',
        category: 'escalation',
        whenCondition: 'When escalated',
        instructions: 'Notify manager',
        enabled: true,
      })
      const after = await fetchGuidanceRules()
      expect(after.length).toBe(before.length + 1)
    })
  })

  describe('updateGuidanceRule', () => {
    it('merges the patch into the rule', async () => {
      const rules = await fetchGuidanceRules()
      const first = rules[0]!
      const updated = await updateGuidanceRule(first.id, { name: 'Renamed' })
      expect(updated.name).toBe('Renamed')
      expect(updated.category).toBe(first.category)
    })

    it('updates the updatedAt timestamp', async () => {
      const rules = await fetchGuidanceRules()
      const first = rules[0]!
      const updated = await updateGuidanceRule(first.id, { enabled: false })
      expect(updated.updatedAt).not.toBe(first.updatedAt)
    })

    it('throws for unknown id', async () => {
      await expect(updateGuidanceRule('unknown', { name: 'x' })).rejects.toThrow()
    })
  })

  describe('deleteGuidanceRule', () => {
    it('removes the rule from the store', async () => {
      const rules = await fetchGuidanceRules()
      const first = rules[0]!
      await deleteGuidanceRule(first.id)
      const after = await fetchGuidanceRules()
      expect(after.length).toBe(rules.length - 1)
      expect(after.find((r) => r.id === first.id)).toBeUndefined()
    })

    it('throws for unknown id', async () => {
      await expect(deleteGuidanceRule('unknown')).rejects.toThrow()
    })
  })
})

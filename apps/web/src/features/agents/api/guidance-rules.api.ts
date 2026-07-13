import type { GuidanceRule } from '../types'
import { createMockStore, simulateLatency, maybeThrowError } from './mock-engine'
import mockData from '../mocks/guidance-rules.json'

const store = createMockStore<GuidanceRule>(mockData.rules as GuidanceRule[])

export { store as guidanceRuleStore }

export async function fetchGuidanceRules(): Promise<GuidanceRule[]> {
  await simulateLatency()
  maybeThrowError()
  return store.getAll()
}

export async function createGuidanceRule(
  data: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<GuidanceRule> {
  await simulateLatency()
  maybeThrowError()
  const now = new Date().toISOString()
  const rule: GuidanceRule = {
    ...data,
    id: `gr-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  return store.create(rule)
}

export async function updateGuidanceRule(
  id: string,
  patch: Partial<GuidanceRule>
): Promise<GuidanceRule> {
  await simulateLatency()
  maybeThrowError()
  return store.update(id, { ...patch, updatedAt: new Date().toISOString() })
}

export async function deleteGuidanceRule(id: string): Promise<void> {
  await simulateLatency()
  maybeThrowError()
  store.remove(id)
}

export async function fetchGuidanceRule(id: string): Promise<GuidanceRule | null> {
  await simulateLatency()
  maybeThrowError()
  return store.getById(id) ?? null
}

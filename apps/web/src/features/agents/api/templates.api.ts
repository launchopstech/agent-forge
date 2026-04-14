import type { AgentTemplate } from '../types'
import templatesMock from '../mocks/templates.json'
import { simulateLatency, maybeThrowError } from './mock-engine'

// TODO: Replace mock data with real API calls using apiClient from @forge/api-client

export async function fetchTemplates(category?: string): Promise<AgentTemplate[]> {
  await simulateLatency()
  maybeThrowError()
  let templates = templatesMock.templates as AgentTemplate[]
  if (category && category !== 'all') {
    templates = templates.filter((t) => t.category === category || t.category === 'blank')
  }
  return templates
}

export async function fetchTemplate(id: string): Promise<AgentTemplate | null> {
  await simulateLatency()
  maybeThrowError()
  const template = templatesMock.templates.find((t) => t.id === id)
  return (template as AgentTemplate) ?? null
}

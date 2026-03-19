import type { AgentTemplate } from '../types'
import templatesMock from '../mocks/templates.json'

// TODO: Replace mock data with real API calls using apiClient from @forge/api-client

export async function fetchTemplates(): Promise<AgentTemplate[]> {
  // TODO: return apiClient.get<AgentTemplate[]>('/api/agent-templates')
  return Promise.resolve(templatesMock.templates as AgentTemplate[])
}

export async function fetchTemplate(id: string): Promise<AgentTemplate | null> {
  // TODO: return apiClient.get<AgentTemplate>(`/api/agent-templates/${id}`)
  const template = templatesMock.templates.find((t) => t.id === id)
  return Promise.resolve((template as AgentTemplate) ?? null)
}

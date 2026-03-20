import type { Agent } from '../types'
import agentsMock from '../mocks/agents.json'

// TODO: Replace mock data with real API calls using apiClient from @forge/api-client
// e.g. import { apiClient } from '@forge/api-client'

export async function fetchAgents(): Promise<Agent[]> {
  // TODO: return apiClient.get<Agent[]>('/api/agents')
  return Promise.resolve(agentsMock.agents as Agent[])
}

export async function fetchAgent(id: string): Promise<Agent | null> {
  // TODO: return apiClient.get<Agent>(`/api/agents/${id}`)
  const agent = agentsMock.agents.find((a) => a.id === id)
  return Promise.resolve((agent as Agent) ?? null)
}

export async function createAgent(data: Omit<Agent, 'id'>): Promise<Agent> {
  // TODO: return apiClient.post<Agent>('/api/agents', data)
  const newAgent: Agent = { ...data, id: String(Date.now()) }
  return Promise.resolve(newAgent)
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
  // TODO: return apiClient.patch<Agent>(`/api/agents/${id}`, data)
  const existing = agentsMock.agents.find((a) => a.id === id) as Agent | undefined
  if (!existing) {
    throw new Error(`Agent ${id} not found`)
  }
  return Promise.resolve({ ...existing, ...data })
}

export async function deleteAgent(id: string): Promise<void> {
  // TODO: return apiClient.delete(`/api/agents/${id}`)
  return Promise.resolve()
}

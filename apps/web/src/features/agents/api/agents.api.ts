import type { Agent, AgentListParams, PaginatedResponse } from '../types'
import agentsMock from '../mocks/agents.json'
import { createMockStore, simulateLatency, maybeThrowError } from './mock-engine'

// TODO: Replace mock store with real API calls using apiClient from @forge/api-client

const store = createMockStore<Agent>(agentsMock.agents as Agent[])

export { store as agentStore }

export async function fetchAgents(params?: AgentListParams): Promise<PaginatedResponse<Agent>> {
  await simulateLatency()
  maybeThrowError()

  const { page = 1, pageSize = 10, search, status } = params ?? {}
  let agents = store.getAll()

  if (status) {
    agents = agents.filter((a) => a.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    agents = agents.filter((a) => a.name.toLowerCase().includes(q))
  }

  const total = agents.length
  const start = (page - 1) * pageSize
  const data = agents.slice(start, start + pageSize)

  return { data, total, page, pageSize }
}

export async function fetchAgent(id: string): Promise<Agent | null> {
  await simulateLatency()
  maybeThrowError()
  return (store.getById(id) as Agent | undefined) ?? null
}

export async function createAgent(data: Omit<Agent, 'id'>): Promise<Agent> {
  await simulateLatency()
  maybeThrowError()
  return store.create({ ...data, id: String(Date.now()) } as Agent)
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
  await simulateLatency()
  maybeThrowError()
  return store.update(id, data)
}

export async function deleteAgent(id: string): Promise<void> {
  await simulateLatency()
  maybeThrowError()
  store.remove(id)
}

import type { TestMessage } from '../types'

export type ChatMessage = Pick<TestMessage, 'role' | 'content'>

export interface PublicAgentMetadata {
  id: string
  name: string
  welcomeMessage: string | null
  status: 'live'
}

function apiUrl(path: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_FORGE_API_BASE_URL ?? process.env.PUBLIC_FORGE_API_BASE_URL ?? ''
  return `${baseUrl}${path}`
}

async function* readSseDeltas(response: Response): AsyncGenerator<string> {
  if (!response.ok) throw new Error(`Chat error: ${response.status}`)
  if (!response.body) throw new Error('Chat error: empty response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      let json: { type: string; content?: string }
      try {
        json = JSON.parse(line.slice(6)) as { type: string; content?: string }
      } catch {
        continue
      }
      if (json.type === 'delta') yield json.content ?? ''
      if (json.type === 'done') return
    }
  }
}

function tokenQuery(shareToken: string): string {
  return `token=${encodeURIComponent(shareToken)}`
}

function mergeHeaders(defaults: Record<string, string>, headers?: HeadersInit): HeadersInit {
  if (!headers) return defaults
  if (headers instanceof Headers) return { ...defaults, ...Object.fromEntries(headers.entries()) }
  if (Array.isArray(headers)) return { ...defaults, ...Object.fromEntries(headers) }
  return { ...defaults, ...headers }
}

export async function fetchPublicAgent(
  agentId: string,
  shareToken: string,
  init?: RequestInit
): Promise<PublicAgentMetadata | null> {
  const response = await fetch(apiUrl(`/api/public/agents/${agentId}?${tokenQuery(shareToken)}`), {
    ...init,
    headers: mergeHeaders({ Accept: 'application/json' }, init?.headers),
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Agent lookup error: ${response.status}`)

  return response.json() as Promise<PublicAgentMetadata>
}

export async function* streamChat(
  agentId: string,
  messages: ChatMessage[],
  getToken: () => Promise<string | null>,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const token = await getToken()
  const response = await fetch(apiUrl(`/api/agents/${agentId}/chat/stream`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    signal,
  })

  yield* readSseDeltas(response)
}

export async function* streamPublicChat(
  agentId: string,
  messages: ChatMessage[],
  shareToken: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const response = await fetch(
    apiUrl(`/api/public/agents/${agentId}/chat/stream?${tokenQuery(shareToken)}`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ messages }),
      signal,
    }
  )

  yield* readSseDeltas(response)
}

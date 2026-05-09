import type { TestMessage } from '../types'

export type ChatMessage = Pick<TestMessage, 'role' | 'content'>

export async function* streamChat(
  agentId: string,
  messages: ChatMessage[],
  getToken: () => Promise<string | null>,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const token = await getToken()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FORGE_API_BASE_URL ?? ''}/api/agents/${agentId}/chat/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages }),
      signal,
    }
  )

  if (!response.ok) throw new Error(`Chat error: ${response.status}`)

  const reader = response.body!.getReader()
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
      const json = JSON.parse(line.slice(6)) as { type: string; content?: string }
      if (json.type === 'delta') yield json.content ?? ''
      if (json.type === 'done') return
    }
  }
}

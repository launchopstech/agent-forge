import type { ChatMessage, WidgetConfig } from './types'

export async function fetchAgentMeta(
  cfg: WidgetConfig
): Promise<{ name: string; description: string } | null> {
  try {
    const res = await fetch(
      `${cfg.apiUrl}/api/public/agents/${cfg.agentId}?token=${cfg.shareToken}`
    )
    if (!res.ok) return null
    return res.json() as Promise<{ name: string; description: string }>
  } catch {
    return null
  }
}

/**
 * Streams a chat response from the public chat SSE endpoint.
 * Yields text chunks as they arrive; terminates on "done" event or abort.
 */
export async function* streamChat(
  cfg: WidgetConfig,
  messages: ChatMessage[],
  signal: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(
    `${cfg.apiUrl}/api/public/agents/${cfg.agentId}/chat/stream?token=${cfg.shareToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    }
  )

  if (!res.ok || !res.body) {
    throw new Error(`Chat request failed: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (!payload) continue

        let event: { type: string; content?: string }
        try {
          event = JSON.parse(payload) as { type: string; content?: string }
        } catch {
          continue
        }

        if (event.type === 'done') return
        if (event.type === 'delta' && event.content) {
          yield event.content
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

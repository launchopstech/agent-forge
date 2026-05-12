import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchPublicAgent, streamChat, streamPublicChat } from './chat.api'

// Helper: encode SSE lines into a ReadableStream
function makeStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line))
      }
      controller.close()
    },
  })
}

function makeMockResponse(status: number, body: ReadableStream<Uint8Array> | null) {
  return {
    ok: status >= 200 && status < 300,
    status,
    body,
  } as unknown as Response
}

function makeJsonResponse(status: number, data: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    body: null,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response
}

const GET_TOKEN = vi.fn().mockResolvedValue('test-token')

beforeEach(() => {
  vi.clearAllMocks()
  GET_TOKEN.mockResolvedValue('test-token')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('streamChat', () => {
  it('yields delta chunks in order', async () => {
    const body = makeStream([
      'data: {"type":"delta","content":"Hello"}\n',
      'data: {"type":"delta","content":" world"}\n',
      'data: {"type":"done"}\n',
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamChat('agent-1', [], GET_TOKEN)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['Hello', ' world'])
  })

  it('throws on non-200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(400, makeStream([]))))

    await expect(async () => {
      for await (const _ of streamChat('agent-1', [], GET_TOKEN)) {
        // drain
      }
    }).rejects.toThrow('Chat error: 400')
  })

  it('terminates on {"type":"done"} before reader.done', async () => {
    const body = makeStream([
      'data: {"type":"delta","content":"partial"}\n',
      'data: {"type":"done"}\n',
      'data: {"type":"delta","content":"should not appear"}\n',
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamChat('agent-1', [], GET_TOKEN)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['partial'])
    expect(chunks).not.toContain('should not appear')
  })

  it('terminates cleanly on connection drop (reader.done)', async () => {
    const body = makeStream([
      'data: {"type":"delta","content":"ok"}\n',
      // stream ends here without a "done" event
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamChat('agent-1', [], GET_TOKEN)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['ok'])
  })

  it('propagates AbortError when signal is aborted', async () => {
    const controller = new AbortController()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => {
        controller.abort()
        const err = new DOMException('The operation was aborted.', 'AbortError')
        return Promise.reject(err)
      })
    )

    await expect(async () => {
      for await (const _ of streamChat('agent-1', [], GET_TOKEN, controller.signal)) {
        // drain
      }
    }).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('parses \\r\\n line endings the same as \\n', async () => {
    const body = makeStream([
      'data: {"type":"delta","content":"cr-lf"}\r\n',
      'data: {"type":"done"}\r\n',
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamChat('agent-1', [], GET_TOKEN)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['cr-lf'])
  })

  it('skips non-data lines (blank lines, event: lines) without error', async () => {
    const body = makeStream([
      '\n',
      'event: message\n',
      'data: {"type":"delta","content":"visible"}\n',
      '\n',
      'data: {"type":"done"}\n',
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamChat('agent-1', [], GET_TOKEN)) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['visible'])
  })
})

describe('fetchPublicAgent', () => {
  it('fetches public metadata with the share token query parameter', async () => {
    const metadata = {
      id: 'agent-1',
      name: 'Public Bot',
      welcomeMessage: 'Hello',
      status: 'live',
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(200, metadata)))

    await expect(fetchPublicAgent('agent-1', 'share token')).resolves.toEqual(metadata)

    expect(fetch).toHaveBeenCalledWith(
      '/api/public/agents/agent-1?token=share%20token',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      })
    )
  })

  it('returns null when the public metadata endpoint returns 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeJsonResponse(404, {})))

    await expect(fetchPublicAgent('agent-1', 'bad-token')).resolves.toBeNull()
  })
})

describe('streamPublicChat', () => {
  it('streams public chat without an Authorization header', async () => {
    const body = makeStream([
      'data: {"type":"delta","content":"public"}\n',
      'data: {"type":"done"}\n',
    ])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(200, body)))

    const chunks: string[] = []
    for await (const chunk of streamPublicChat('agent-1', [], 'share-token')) {
      chunks.push(chunk)
    }

    expect(chunks).toEqual(['public'])
    expect(fetch).toHaveBeenCalledWith(
      '/api/public/agents/agent-1/chat/stream?token=share-token',
      expect.objectContaining({
        method: 'POST',
        headers: expect.not.objectContaining({ Authorization: expect.any(String) }),
      })
    )
  })

  it('throws when the public stream request is rejected', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMockResponse(404, makeStream([]))))

    await expect(async () => {
      for await (const _ of streamPublicChat('agent-1', [], 'bad-token')) {
        // drain
      }
    }).rejects.toThrow('Chat error: 404')
  })
})

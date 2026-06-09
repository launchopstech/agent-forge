import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('resend')

import { Resend } from 'resend'
import { ResendAdapter } from './resend'

const OPTIONS = {
  from: 'noreply@example.com',
  to: ['user@example.com'],
  subject: 'Test Subject',
  text: 'Test body',
}

function mockResendSend(returnValue: { error: { message: string } | null }) {
  const mockSend = vi.fn().mockResolvedValue(returnValue)
  vi.mocked(Resend).mockImplementation(() => ({ emails: { send: mockSend } }) as unknown as Resend)
  return mockSend
}

describe('ResendAdapter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, RESEND_API_KEY: 'test-key-123' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns { ok: true } when SDK reports no error', async () => {
    mockResendSend({ error: null })
    const adapter = new ResendAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result).toEqual({ ok: true })
  })

  it('returns { ok: false, error } when SDK returns an error object', async () => {
    mockResendSend({ error: { message: 'Invalid recipient' } })
    const adapter = new ResendAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result.ok).toBe(false)
    expect(result.error).toBe('Invalid recipient')
  })

  it('returns { ok: false } when RESEND_API_KEY is not set', async () => {
    delete process.env.RESEND_API_KEY
    const adapter = new ResendAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result).toEqual({ ok: false, error: 'RESEND_API_KEY not set' })
    expect(Resend).not.toHaveBeenCalled()
  })

  it('passes from, to, subject, text to the SDK', async () => {
    const mockSend = mockResendSend({ error: null })
    const adapter = new ResendAdapter()
    await adapter.send(OPTIONS)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'noreply@example.com',
        to: ['user@example.com'],
        subject: 'Test Subject',
        text: 'Test body',
      })
    )
  })

  it('passes replyTo to the SDK', async () => {
    const mockSend = mockResendSend({ error: null })
    const adapter = new ResendAdapter()
    await adapter.send({ ...OPTIONS, replyTo: 'customer@example.com' })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: 'customer@example.com' })
    )
  })

  it('passes html when provided', async () => {
    const mockSend = mockResendSend({ error: null })
    const adapter = new ResendAdapter()
    await adapter.send({ ...OPTIONS, html: '<p>Hello</p>' })
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ html: '<p>Hello</p>' }))
  })

  it('initialises Resend with the API key from env', async () => {
    mockResendSend({ error: null })
    const adapter = new ResendAdapter()
    await adapter.send(OPTIONS)
    expect(Resend).toHaveBeenCalledWith('test-key-123')
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@getbrevo/brevo')

import { BrevoClient } from '@getbrevo/brevo'
import { BrevoAdapter } from './brevo'

const OPTIONS = {
  from: 'Blue Stone Construction <noreply@bluestoneconstruction.llc>',
  to: ['admin@bluestoneconstruction.llc'],
  subject: 'Test Subject',
  text: 'Test body',
}

function mockBrevoSend(impl?: () => Promise<unknown>) {
  const mockSend = impl ? vi.fn().mockImplementation(impl) : vi.fn().mockResolvedValue({})
  vi.mocked(BrevoClient).mockImplementation(
    () =>
      ({
        transactionalEmails: { sendTransacEmail: mockSend },
      }) as unknown as BrevoClient
  )
  return mockSend
}

describe('BrevoAdapter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, BREVO_API_KEY: 'test-brevo-key' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns { ok: true } on success', async () => {
    mockBrevoSend()
    const adapter = new BrevoAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result).toEqual({ ok: true })
  })

  it('returns { ok: false } when BREVO_API_KEY is not set', async () => {
    delete process.env.BREVO_API_KEY
    const adapter = new BrevoAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result).toEqual({ ok: false, error: 'BREVO_API_KEY not set' })
    expect(BrevoClient).not.toHaveBeenCalled()
  })

  it('returns { ok: false, error } when SDK throws', async () => {
    mockBrevoSend(() => Promise.reject(new Error('rate limited')))
    const adapter = new BrevoAdapter()
    const result = await adapter.send(OPTIONS)
    expect(result.ok).toBe(false)
    expect(result.error).toBe('rate limited')
  })

  it('parses "Name <email>" sender format correctly', async () => {
    const mockSend = mockBrevoSend()
    const adapter = new BrevoAdapter()
    await adapter.send(OPTIONS)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: { name: 'Blue Stone Construction', email: 'noreply@bluestoneconstruction.llc' },
      })
    )
  })

  it('uses raw email when from has no display name', async () => {
    const mockSend = mockBrevoSend()
    const adapter = new BrevoAdapter()
    await adapter.send({ ...OPTIONS, from: 'noreply@bluestoneconstruction.llc' })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        sender: {
          name: 'noreply@bluestoneconstruction.llc',
          email: 'noreply@bluestoneconstruction.llc',
        },
      })
    )
  })

  it('passes replyTo when provided', async () => {
    const mockSend = mockBrevoSend()
    const adapter = new BrevoAdapter()
    await adapter.send({ ...OPTIONS, replyTo: 'customer@example.com' })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: { email: 'customer@example.com' } })
    )
  })

  it('passes html and text content', async () => {
    const mockSend = mockBrevoSend()
    const adapter = new BrevoAdapter()
    await adapter.send({ ...OPTIONS, html: '<p>Hello</p>' })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ htmlContent: '<p>Hello</p>', textContent: 'Test body' })
    )
  })

  it('initialises BrevoClient with the API key from env', async () => {
    mockBrevoSend()
    const adapter = new BrevoAdapter()
    await adapter.send(OPTIONS)
    expect(BrevoClient).toHaveBeenCalledWith({ apiKey: 'test-brevo-key' })
  })
})

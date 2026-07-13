import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./templates/registry', () => ({
  loadTemplate: vi.fn(),
}))
vi.mock('./templates/renderer', () => ({
  renderTemplate: vi.fn(),
}))
vi.mock('./providers', () => ({
  getEmailProvider: vi.fn(),
}))

import { sendEmail } from './send-email'
import { loadTemplate } from './templates/registry'
import { renderTemplate } from './templates/renderer'
import { getEmailProvider } from './providers'
import type { EmailTemplateMetadata } from './templates/types'

const META: EmailTemplateMetadata = {
  id: 'test',
  name: 'Test',
  subject: 'Hello',
  textBody: 'Body',
  variables: [],
}
const CONTENT = { subject: 'Hello Alice', text: 'Body Alice' }
const OPTIONS = { from: 'noreply@example.com', to: ['alice@example.com'] }
const DATA = { name: 'Alice' }

describe('sendEmail()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(loadTemplate).mockResolvedValue(META)
    vi.mocked(renderTemplate).mockReturnValue(CONTENT)
    vi.mocked(getEmailProvider).mockReturnValue({ send: vi.fn().mockResolvedValue({ ok: true }) })
  })

  it('loads template by ID, renders it, and calls provider.send', async () => {
    const mockSend = vi.fn().mockResolvedValue({ ok: true })
    vi.mocked(getEmailProvider).mockReturnValue({ send: mockSend })

    await sendEmail('test', DATA, OPTIONS)

    expect(loadTemplate).toHaveBeenCalledWith('test')
    expect(renderTemplate).toHaveBeenCalledWith(META, DATA)
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining(CONTENT))
  })

  it('skips loadTemplate when a metadata object is passed directly', async () => {
    await sendEmail(META, DATA, OPTIONS)

    expect(loadTemplate).not.toHaveBeenCalled()
    expect(renderTemplate).toHaveBeenCalledWith(META, DATA)
  })

  it('merges delivery options with rendered content when calling send', async () => {
    const mockSend = vi.fn().mockResolvedValue({ ok: true })
    vi.mocked(getEmailProvider).mockReturnValue({ send: mockSend })

    await sendEmail('test', DATA, OPTIONS)

    expect(mockSend).toHaveBeenCalledWith({ ...OPTIONS, ...CONTENT })
  })

  it('returns provider result unchanged on success', async () => {
    vi.mocked(getEmailProvider).mockReturnValue({
      send: vi.fn().mockResolvedValue({ ok: true }),
    })
    const result = await sendEmail('test', DATA, OPTIONS)
    expect(result).toEqual({ ok: true })
  })

  it('returns provider error result unchanged', async () => {
    vi.mocked(getEmailProvider).mockReturnValue({
      send: vi.fn().mockResolvedValue({ ok: false, error: 'send failed' }),
    })
    const result = await sendEmail('test', DATA, OPTIONS)
    expect(result).toEqual({ ok: false, error: 'send failed' })
  })

  it('propagates loadTemplate rejection when template id is unknown', async () => {
    vi.mocked(loadTemplate).mockRejectedValue(new Error('[email] Template "bad" not found'))
    await expect(sendEmail('bad', DATA, OPTIONS)).rejects.toThrow('not found')
  })
})

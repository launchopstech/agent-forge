import { describe, it, expect } from 'vitest'
import { submitExampleForm } from './actions'

function makeFormData(data: Record<string, string>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.append(k, v))
  return fd
}

const prev = { ok: false as const, error: '' }

describe('submitExampleForm()', () => {
  it('returns fieldErrors for all fields on empty submission', async () => {
    const result = await submitExampleForm(prev, makeFormData({}))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fieldErrors?.name).toBeDefined()
      expect(result.fieldErrors?.email).toBeDefined()
      expect(result.fieldErrors?.message).toBeDefined()
    }
  })

  it('returns ok: true with valid data', async () => {
    const result = await submitExampleForm(
      prev,
      makeFormData({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'This is a valid message that is long enough',
      })
    )
    expect(result).toEqual({ ok: true, data: undefined })
  })

  it('returns fieldError for invalid email', async () => {
    const result = await submitExampleForm(
      prev,
      makeFormData({ name: 'Jane', email: 'not-an-email', message: 'Valid message here' })
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors?.email).toBeDefined()
  })

  it('returns fieldError for name shorter than 2 characters', async () => {
    const result = await submitExampleForm(
      prev,
      makeFormData({ name: 'J', email: 'jane@example.com', message: 'Valid message here' })
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors?.name).toBeDefined()
  })

  it('returns fieldError for message shorter than 10 characters', async () => {
    const result = await submitExampleForm(
      prev,
      makeFormData({ name: 'Jane', email: 'jane@example.com', message: 'Too short' })
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors?.message).toBeDefined()
  })
})

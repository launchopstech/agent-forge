import { describe, it, expect, beforeEach } from 'vitest'
import { registerTemplate, loadTemplate, clearRegistry } from './registry'
import type { EmailTemplateMetadata } from './types'

const makeTemplate = (id: string): EmailTemplateMetadata => ({
  id,
  name: `Template ${id}`,
  subject: 'Subject',
  textBody: 'Body',
  variables: [],
})

beforeEach(() => {
  clearRegistry()
})

describe('registerTemplate() / loadTemplate()', () => {
  it('registers a template and retrieves it by id', async () => {
    const t = makeTemplate('welcome')
    registerTemplate(t)
    const loaded = await loadTemplate('welcome')
    expect(loaded).toEqual(t)
  })

  it('overwrites an existing template on re-register', async () => {
    registerTemplate(makeTemplate('foo'))
    const updated = { ...makeTemplate('foo'), name: 'Updated' }
    registerTemplate(updated)
    const loaded = await loadTemplate('foo')
    expect(loaded.name).toBe('Updated')
  })

  it('throws a helpful error for an unknown template id', async () => {
    await expect(loadTemplate('missing')).rejects.toThrow('"missing"')
    await expect(loadTemplate('missing')).rejects.toThrow('[email]')
  })

  it('returns a promise (async-compatible)', async () => {
    registerTemplate(makeTemplate('async-test'))
    const result = loadTemplate('async-test')
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBeDefined()
  })

  it('isolates templates across tests via clearRegistry()', async () => {
    registerTemplate(makeTemplate('isolated'))
    clearRegistry()
    await expect(loadTemplate('isolated')).rejects.toThrow()
  })

  it('stores multiple templates independently', async () => {
    registerTemplate(makeTemplate('a'))
    registerTemplate(makeTemplate('b'))
    const a = await loadTemplate('a')
    const b = await loadTemplate('b')
    expect(a.id).toBe('a')
    expect(b.id).toBe('b')
  })
})

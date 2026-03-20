import { describe, it, expect } from 'vitest'
import { fetchTemplates, fetchTemplate } from './templates.api'

describe('templates.api', () => {
  describe('fetchTemplates', () => {
    it('returns all templates', async () => {
      const templates = await fetchTemplates()
      expect(templates.length).toBeGreaterThan(0)
    })

    it('every template has required fields', async () => {
      const templates = await fetchTemplates()
      for (const tpl of templates) {
        expect(tpl).toHaveProperty('id')
        expect(tpl).toHaveProperty('name')
        expect(tpl).toHaveProperty('emoji')
        expect(tpl).toHaveProperty('category')
        expect(tpl).toHaveProperty('description')
        expect(tpl).toHaveProperty('identity')
        expect(tpl).toHaveProperty('behaviour')
        expect(Array.isArray(tpl.actions)).toBe(true)
        expect(Array.isArray(tpl.knowledge)).toBe(true)
        expect(Array.isArray(tpl.channels)).toBe(true)
      }
    })
  })

  describe('fetchTemplate', () => {
    it('returns template by id', async () => {
      const template = await fetchTemplate('customer-support')
      expect(template).not.toBeNull()
      expect(template?.id).toBe('customer-support')
      expect(template?.identity.tone).toBe('professional')
    })

    it('returns null for unknown id', async () => {
      const template = await fetchTemplate('does-not-exist')
      expect(template).toBeNull()
    })
  })
})

import { describe, it, expect } from 'vitest'
import { readdirSync } from 'fs'
import { join } from 'path'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import { routing } from './routing'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all dot-separated keys from a nested object. */
function collectKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return collectKeys(value as object, full)
    }
    return [full]
  })
}

const messagesDir = join(__dirname, '../messages')

const localeFiles: Record<string, typeof en> = {
  en,
  fr,
}

// ---------------------------------------------------------------------------
// 1. Key parity — every locale must have exactly the same keys as en.json
// ---------------------------------------------------------------------------
describe('i18n key parity', () => {
  const enKeys = collectKeys(en).sort()

  for (const [name, messages] of Object.entries(localeFiles)) {
    if (name === 'en') continue

    it(`${name}.json contains all keys from en.json`, () => {
      const localeKeys = new Set(collectKeys(messages))
      const missing = enKeys.filter((k) => !localeKeys.has(k))
      expect(
        missing,
        `${name}.json is missing these keys:\n  ${missing.join('\n  ')}`
      ).toHaveLength(0)
    })

    it(`${name}.json has no extra keys not in en.json`, () => {
      const enKeySet = new Set(enKeys)
      const extra = collectKeys(messages).filter((k) => !enKeySet.has(k))
      expect(
        extra,
        `${name}.json has extra keys not in en.json:\n  ${extra.join('\n  ')}`
      ).toHaveLength(0)
    })
  }
})

// ---------------------------------------------------------------------------
// 2. No empty values — every key must have a non-empty translation
// ---------------------------------------------------------------------------
describe('i18n no empty values', () => {
  for (const [name, messages] of Object.entries(localeFiles)) {
    it(`${name}.json has no empty string values`, () => {
      const keys = collectKeys(messages)
      const raw = messages as Record<string, unknown>

      function getValue(obj: Record<string, unknown>, dotKey: string): unknown {
        return dotKey.split('.').reduce((acc: unknown, part) => {
          return acc !== null && typeof acc === 'object'
            ? (acc as Record<string, unknown>)[part]
            : undefined
        }, obj)
      }

      const empty = keys.filter((k) => {
        const v = getValue(raw, k)
        return typeof v === 'string' && v.trim() === ''
      })
      expect(empty, `${name}.json has empty values for:\n  ${empty.join('\n  ')}`).toHaveLength(0)
    })
  }
})

// ---------------------------------------------------------------------------
// 3. Locale file coverage — routing.locales matches message files on disk
// ---------------------------------------------------------------------------
describe('i18n locale coverage', () => {
  it('every locale in routing.locales has a messages file', () => {
    const files = readdirSync(messagesDir).map((f) => f.replace('.json', ''))
    const missing = routing.locales.filter((l) => !files.includes(l))
    expect(missing, `No message file found for locale(s): ${missing.join(', ')}`).toHaveLength(0)
  })

  it('every messages file on disk is registered in routing.locales', () => {
    const files = readdirSync(messagesDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
    const unregistered = files.filter(
      (f) => !routing.locales.includes(f as (typeof routing.locales)[number])
    )
    expect(
      unregistered,
      `Message file(s) exist but not in routing.locales: ${unregistered.join(', ')}`
    ).toHaveLength(0)
  })
})

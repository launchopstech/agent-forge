import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageThemeStore } from './local-storage'

const LIGHT: Record<string, string> = {
  '--primary': 'oklch(0.35 0.15 280)',
  '--background': 'oklch(0.98 0 0)',
}
const DARK: Record<string, string> = {
  '--primary': 'oklch(0.65 0.15 280)',
  '--background': 'oklch(0.12 0 0)',
}

// Mock localStorage with a Map-based implementation
let storage: Map<string, string>
const mockLocalStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
  get length() {
    return storage.size
  },
  key: (index: number) => Array.from(storage.keys())[index] ?? null,
}

let store: LocalStorageThemeStore

beforeEach(() => {
  storage = new Map()
  vi.stubGlobal('localStorage', mockLocalStorage)
  store = new LocalStorageThemeStore()
})

describe('LocalStorageThemeStore.load', () => {
  it('returns null when no data is stored', async () => {
    const result = await store.load('default')
    expect(result).toBeNull()
  })

  it('returns null if stored value is malformed JSON', async () => {
    mockLocalStorage.setItem('forge_theme_default', 'not-json{')
    const result = await store.load('default')
    expect(result).toBeNull()
  })

  it('returns null if stored value is valid JSON but wrong shape', async () => {
    mockLocalStorage.setItem('forge_theme_default', JSON.stringify({ foo: 'bar' }))
    const result = await store.load('default')
    expect(result).toBeNull()
  })
})

describe('LocalStorageThemeStore.save + load roundtrip', () => {
  it('save then load returns the same theme', async () => {
    await store.save('default', { light: LIGHT, dark: DARK })
    const result = await store.load('default')
    expect(result).not.toBeNull()
    expect(result?.light).toEqual(LIGHT)
    expect(result?.dark).toEqual(DARK)
  })

  it('preserves all CSS variable keys and values', async () => {
    const fullLight = { '--primary': 'oklch(0.35 0.15 280)', '--ring': 'oklch(0.35 0.15 280)' }
    await store.save('client-a', { light: fullLight, dark: DARK })
    const result = await store.load('client-a')
    expect(result?.light).toStrictEqual(fullLight)
  })
})

describe('LocalStorageThemeStore.reset', () => {
  it('removes the stored value', async () => {
    await store.save('default', { light: LIGHT, dark: DARK })
    await store.reset('default')
    const result = await store.load('default')
    expect(result).toBeNull()
  })
})

describe('key isolation', () => {
  it('saving brand A does not affect brand B', async () => {
    await store.save('client-a', { light: LIGHT, dark: DARK })
    const brandB = await store.load('client-b')
    expect(brandB).toBeNull()
  })

  it('each brand has its own key in localStorage', async () => {
    await store.save('client-a', { light: LIGHT, dark: DARK })
    await store.save('client-b', { light: { '--primary': 'oklch(0.5 0.2 220)' }, dark: DARK })
    const a = await store.load('client-a')
    const b = await store.load('client-b')
    expect(a?.light['--primary']).toBe('oklch(0.35 0.15 280)')
    expect(b?.light['--primary']).toBe('oklch(0.5 0.2 220)')
  })
})

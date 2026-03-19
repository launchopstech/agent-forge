import type { ThemeStore } from './types'

const KEY_PREFIX = 'forge_theme_'

export class LocalStorageThemeStore implements ThemeStore {
  private key(brandKey: string): string {
    return `${KEY_PREFIX}${brandKey}`
  }

  async load(
    brandKey: string
  ): Promise<{ light: Record<string, string>; dark: Record<string, string> } | null> {
    try {
      const raw = localStorage.getItem(this.key(brandKey))
      if (!raw) return null
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === 'object' && 'light' in parsed && 'dark' in parsed) {
        return parsed as { light: Record<string, string>; dark: Record<string, string> }
      }
      return null
    } catch {
      return null
    }
  }

  async save(
    brandKey: string,
    theme: { light: Record<string, string>; dark: Record<string, string> }
  ): Promise<void> {
    localStorage.setItem(this.key(brandKey), JSON.stringify(theme))
  }

  async reset(brandKey: string): Promise<void> {
    localStorage.removeItem(this.key(brandKey))
  }
}

export type { ThemeStore } from './types'
export { LocalStorageThemeStore } from './local-storage'

// SWAP POINT: replace with SanityThemeStore / ApiThemeStore when CMS is ready
import { LocalStorageThemeStore } from './local-storage'
import type { ThemeStore } from './types'

export const themeStore: ThemeStore = new LocalStorageThemeStore()

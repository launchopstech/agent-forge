import { useTheme as useNextTheme } from 'next-themes'

export type Theme = 'light' | 'dark' | 'system'

export interface UseThemeReturn {
  theme: Theme
  resolvedTheme: 'light' | 'dark' | undefined
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

export function useTheme(): UseThemeReturn {
  const { theme, resolvedTheme, setTheme } = useNextTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: (theme as Theme) ?? 'system',
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    setTheme: (t: Theme) => setTheme(t),
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  }
}

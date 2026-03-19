'use client'

import { useEffect } from 'react'
import { useTheme } from './use-theme'
import { defaultTheme } from './themes/default'
import { darkTheme } from './themes/dark'

type BrandPreset = 'default'

const PRESETS: Record<
  BrandPreset,
  { label: string; light: Record<string, string>; dark: Record<string, string> }
> = {
  default: { label: 'Default (Purple)', light: defaultTheme, dark: darkTheme },
}

function applyThemeVars(vars: Record<string, string>) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeSwitcher() {
  const { isDark, toggleTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const preset = PRESETS['default']
    applyThemeVars(isDark ? preset.dark : preset.light)
  }, [isDark])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--foreground)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <span style={{ opacity: 0.6 }}>DEV</span>
      <button
        suppressHydrationWarning
        onClick={toggleTheme}
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none',
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '0.25rem 0.625rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
        }}
      >
        {resolvedTheme === 'dark' ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
  )
}

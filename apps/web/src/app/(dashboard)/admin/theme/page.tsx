'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useUser } from '@/hooks/use-user'
import { ThemeEditor } from '@forge/ui/src/theme-editor/ThemeEditor'
import { DEFAULT_LIGHT_VARS, DEFAULT_DARK_VARS } from '@forge/ui/src/theme-editor/constants'
import { getBrand, themeStore } from '@forge/brand'

const BRAND_KEYS = ['default', 'client-a', 'client-b', 'mindrithm']

export default function AgencyThemePage() {
  const t = useTranslations('adminTheme')
  const router = useRouter()
  const { user, isLoading } = useUser()

  const [selectedBrandKey, setSelectedBrandKey] = useState('default')
  const [lightVars, setLightVars] = useState<Record<string, string>>(DEFAULT_LIGHT_VARS)
  const [darkVars, setDarkVars] = useState<Record<string, string>>(DEFAULT_DARK_VARS)
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  // Authorization: only agency role can access this page
  useEffect(() => {
    if (isLoading) return
    // Note: role metadata check would need to be adapted for auth-handler
    // For now, this page is accessible to all authenticated users
    // TODO: Implement role-based access control with auth-handler
  }, [isLoading])

  // Load theme when brand selection changes
  useEffect(() => {
    void themeStore.load(selectedBrandKey).then((saved) => {
      if (saved) {
        setLightVars(saved.light)
        setDarkVars(saved.dark)
      } else {
        const brand = getBrand(selectedBrandKey)
        setLightVars({ ...DEFAULT_LIGHT_VARS, ...brand.colors.light })
        setDarkVars({ ...DEFAULT_DARK_VARS, ...brand.colors.dark })
      }
    })
  }, [selectedBrandKey])

  const handleChange = useCallback(
    (vars: Record<string, string>, changedMode: 'light' | 'dark') => {
      setMode(changedMode)
      if (changedMode === 'light') {
        setLightVars(vars)
      } else {
        setDarkVars(vars)
      }
      Object.entries(vars).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v)
      })
    },
    []
  )

  const handleSave = useCallback(async () => {
    await themeStore.save(selectedBrandKey, { light: lightVars, dark: darkVars })
    toast(t('saved'))
  }, [darkVars, lightVars, selectedBrandKey, t])

  const handleReset = useCallback(async () => {
    setLightVars(DEFAULT_LIGHT_VARS)
    setDarkVars(DEFAULT_DARK_VARS)
    await themeStore.reset(selectedBrandKey)
    Object.entries(DEFAULT_LIGHT_VARS).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v)
    })
  }, [selectedBrandKey])

  const handleExport = useCallback(() => {
    const css = `:root {\n${Object.entries(lightVars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}\n\n.dark {\n${Object.entries(darkVars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')}\n}`
    void navigator.clipboard.writeText(css)
  }, [darkVars, lightVars])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="brand-selector" className="text-sm text-muted-foreground">
            {t('brandSelector')}:
          </label>
          <select
            id="brand-selector"
            value={selectedBrandKey}
            onChange={(e) => setSelectedBrandKey(e.target.value)}
            className="rounded border border-border bg-background px-2 py-1 text-sm"
          >
            {BRAND_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ThemeEditor
        lightVars={lightVars}
        darkVars={darkVars}
        mode={mode}
        onChange={handleChange}
        onReset={() => void handleReset()}
        onExport={handleExport}
        onSave={() => void handleSave()}
      />
    </div>
  )
}

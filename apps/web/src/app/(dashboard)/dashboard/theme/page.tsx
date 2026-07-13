'use client'
export const dynamic = 'force-dynamic'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { ThemeEditor } from '@forge/ui/src/theme-editor/ThemeEditor'
import { DEFAULT_LIGHT_VARS, DEFAULT_DARK_VARS } from '@forge/ui/src/theme-editor/constants'
import { useTenant } from '@forge/brand'
import { themeStore } from '@forge/brand'

export default function AdminThemePage() {
  const t = useTranslations('adminTheme')
  const brand = useTenant()

  const [lightVars, setLightVars] = useState<Record<string, string>>(DEFAULT_LIGHT_VARS)
  const [darkVars, setDarkVars] = useState<Record<string, string>>(DEFAULT_DARK_VARS)
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    void themeStore.load(brand.key).then((saved) => {
      if (saved) {
        setLightVars(saved.light)
        setDarkVars(saved.dark)
      }
    })
  }, [brand.key])

  const handleChange = useCallback(
    (vars: Record<string, string>, changedMode: 'light' | 'dark') => {
      setMode(changedMode)
      if (changedMode === 'light') {
        setLightVars(vars)
      } else {
        setDarkVars(vars)
      }
      // Live preview — apply each var to the document root
      Object.entries(vars).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v)
      })
    },
    []
  )

  const handleSave = useCallback(async () => {
    await themeStore.save(brand.key, { light: lightVars, dark: darkVars })
    toast(t('saved'))
  }, [brand.key, darkVars, lightVars, t])

  const handleReset = useCallback(async () => {
    setLightVars(DEFAULT_LIGHT_VARS)
    setDarkVars(DEFAULT_DARK_VARS)
    await themeStore.reset(brand.key)
    // Re-apply defaults to DOM
    Object.entries(DEFAULT_LIGHT_VARS).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v)
    })
  }, [brand.key])

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
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

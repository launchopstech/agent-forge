/**
 * ThemeEditorPanel — Storybook manager addon panel.
 *
 * IMPORTANT: This file runs in the Storybook MANAGER context, which is built
 * with esbuild and has NO access to Tailwind CSS or the app's globals.css.
 * All styling must use inline React style objects.
 *
 * The ThemeEditor component (packages/ui) uses Tailwind and cannot be rendered
 * here. This panel is a self-contained reimplementation using native HTML + inline
 * styles that communicates with the canvas via the FORGE_THEME_UPDATE channel.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { useGlobals, useChannel } from '@storybook/manager-api'
import {
  THEME_GROUPS,
  DEFAULT_LIGHT_VARS,
  DEFAULT_DARK_VARS,
} from '../../../../packages/ui/src/theme-editor/constants'
import { oklchToHex, hexToOklch } from '../../../../packages/ui/src/theme-editor/color-utils'
import { THEME_PRESETS } from '../../../../packages/ui/src/theme-editor/presets'

const FORGE_THEME_UPDATE = 'FORGE_THEME_UPDATE'
const LS_KEY_PREFIX = 'forge_theme_'

// ─── inline style tokens ────────────────────────────────────────────────────

const S = {
  panel: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '12px',
    color: '#1a1a1a',
    overflowY: 'auto' as const,
    height: '100%',
    padding: '10px 12px',
    boxSizing: 'border-box' as const,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingBottom: '10px',
    marginBottom: '10px',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap' as const,
  },
  modeLabel: {
    marginLeft: 'auto',
    color: '#888',
    fontSize: '11px',
  },
  btn: {
    padding: '3px 9px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
    background: '#fff',
    color: '#1a1a1a',
    lineHeight: '1.6',
  },
  btnActive: {
    background: '#1a1a1a',
    color: '#fff',
    borderColor: '#1a1a1a',
  },
  section: {
    marginBottom: '4px',
    border: '1px solid #e8e8e8',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  sectionTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '5px 8px',
    background: '#f7f7f7',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600' as const,
    fontSize: '11px',
    color: '#1a1a1a',
    textAlign: 'left' as const,
  },
  sectionBody: {
    padding: '6px 8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  varLabel: {
    width: '190px',
    flexShrink: 0,
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  swatch: {
    width: '18px',
    height: '18px',
    borderRadius: '3px',
    border: '1px solid #d0d0d0',
    flexShrink: 0,
  },
  colorInput: {
    width: '30px',
    height: '22px',
    padding: '0',
    border: '1px solid #d0d0d0',
    borderRadius: '3px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  textInput: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: '11px',
    border: '1px solid #d0d0d0',
    borderRadius: '3px',
    padding: '2px 5px',
    minWidth: 0,
  },
  rangeInput: {
    flex: 1,
    cursor: 'pointer',
  },
  rangeValue: {
    width: '56px',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#666',
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  presetSelect: {
    padding: '3px 6px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '11px',
    background: '#fff',
    cursor: 'pointer',
    flex: 1,
    maxWidth: '140px',
  },
}

// ─── helpers ────────────────────────────────────────────────────────────────

function loadFromStorage(
  brandKey: string
): { light: Record<string, string>; dark: Record<string, string> } | null {
  try {
    const raw = localStorage.getItem(`${LS_KEY_PREFIX}${brandKey}`)
    if (!raw) return null
    return JSON.parse(raw) as { light: Record<string, string>; dark: Record<string, string> }
  } catch {
    return null
  }
}

function saveToStorage(
  brandKey: string,
  theme: { light: Record<string, string>; dark: Record<string, string> }
): void {
  try {
    localStorage.setItem(`${LS_KEY_PREFIX}${brandKey}`, JSON.stringify(theme))
  } catch {
    // ignore quota / private-mode errors
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export function ThemeEditorPanel({ active }: { active: boolean }) {
  const [globals] = useGlobals()
  const brandKey = (globals['brand'] as string | undefined) ?? 'default'
  const themeMode = (globals['theme'] as 'light' | 'dark' | undefined) ?? 'light'

  const [lightVars, setLightVars] = useState<Record<string, string>>(DEFAULT_LIGHT_VARS)
  const [darkVars, setDarkVars] = useState<Record<string, string>>(DEFAULT_DARK_VARS)
  const [mode, setMode] = useState<'light' | 'dark'>(themeMode)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(THEME_GROUPS.map((g) => [g.label, true]))
  )

  const emit = useChannel({})

  useEffect(() => {
    const saved = loadFromStorage(brandKey)
    setLightVars(saved ? saved.light : DEFAULT_LIGHT_VARS)
    setDarkVars(saved ? saved.dark : DEFAULT_DARK_VARS)
  }, [brandKey])

  useEffect(() => {
    setMode(themeMode)
  }, [themeMode])

  const activeVars = mode === 'light' ? lightVars : darkVars

  const update = useCallback(
    (vars: Record<string, string>, updatedMode: 'light' | 'dark') => {
      const nextLight = updatedMode === 'light' ? vars : lightVars
      const nextDark = updatedMode === 'dark' ? vars : darkVars
      if (updatedMode === 'light') setLightVars(vars)
      else setDarkVars(vars)
      emit(FORGE_THEME_UPDATE, { vars, mode: updatedMode })
      saveToStorage(brandKey, { light: nextLight, dark: nextDark })
    },
    [brandKey, darkVars, emit, lightVars]
  )

  const handleColorChange = useCallback(
    (varName: string, hex: string) => {
      update({ ...activeVars, [varName]: hexToOklch(hex) }, mode)
    },
    [activeVars, mode, update]
  )

  const handleTextChange = useCallback(
    (varName: string, val: string) => {
      update({ ...activeVars, [varName]: val }, mode)
    },
    [activeVars, mode, update]
  )

  const handleRadiusChange = useCallback(
    (varName: string, val: string) => {
      update({ ...activeVars, [varName]: `${val}rem` }, mode)
    },
    [activeVars, mode, update]
  )

  const handleReset = useCallback(() => {
    setLightVars(DEFAULT_LIGHT_VARS)
    setDarkVars(DEFAULT_DARK_VARS)
    try {
      localStorage.removeItem(`${LS_KEY_PREFIX}${brandKey}`)
    } catch {
      // ignore
    }
    emit(FORGE_THEME_UPDATE, {
      vars: mode === 'light' ? DEFAULT_LIGHT_VARS : DEFAULT_DARK_VARS,
      mode,
    })
  }, [brandKey, emit, mode])

  const handleExport = useCallback(() => {
    const css =
      `:root {\n${Object.entries(lightVars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')}\n}` +
      `\n\n.dark {\n${Object.entries(darkVars)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')}\n}`
    void navigator.clipboard.writeText(css)
  }, [darkVars, lightVars])

  const toggleMode = useCallback(() => {
    const next = mode === 'light' ? 'dark' : 'light'
    setMode(next)
    emit(FORGE_THEME_UPDATE, {
      vars: next === 'light' ? lightVars : darkVars,
      mode: next,
    })
  }, [darkVars, emit, lightVars, mode])

  if (!active) return null

  return (
    <div style={S.panel}>
      {/* Toolbar */}
      <div style={S.toolbar}>
        <button style={{ ...S.btn, ...(mode === 'light' ? {} : S.btnActive) }} onClick={toggleMode}>
          {mode === 'light' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <select
          style={S.presetSelect}
          value=""
          onChange={(e) => {
            const preset = THEME_PRESETS[e.target.value]
            if (!preset) return
            const toOklch = (raw: Record<string, string>) =>
              Object.fromEntries(
                Object.entries(raw).map(([k, v]) => [
                  `--${k}`,
                  k === 'radius' ? v : v.startsWith('#') ? hexToOklch(v) : v,
                ])
              )
            const nextLight = { ...DEFAULT_LIGHT_VARS, ...toOklch(preset.light) }
            const nextDark = { ...DEFAULT_DARK_VARS, ...toOklch(preset.dark) }
            setLightVars(nextLight)
            setDarkVars(nextDark)
            emit(FORGE_THEME_UPDATE, { vars: mode === 'light' ? nextLight : nextDark, mode })
            saveToStorage(brandKey, { light: nextLight, dark: nextDark })
          }}
        >
          <option value="">Preset…</option>
          {Object.entries(THEME_PRESETS).map(([key, p]) => (
            <option key={key} value={key}>
              {p.label}
            </option>
          ))}
        </select>
        <button style={S.btn} onClick={handleReset}>
          Reset
        </button>
        <button style={S.btn} onClick={handleExport}>
          Export CSS
        </button>
        <span style={S.modeLabel}>brand: {brandKey}</span>
      </div>

      {/* Variable groups */}
      {THEME_GROUPS.map((group) => (
        <div key={group.label} style={S.section}>
          <button
            style={S.sectionTrigger}
            onClick={() => setOpenSections((p) => ({ ...p, [group.label]: !p[group.label] }))}
          >
            <span>{group.label}</span>
            <span style={{ fontSize: '10px', color: '#888' }}>
              {openSections[group.label] ? '▲' : '▼'}
            </span>
          </button>

          {openSections[group.label] && (
            <div style={S.sectionBody}>
              {group.vars.map((varName) => {
                const value = activeVars[varName] ?? ''

                if (varName === '--radius') {
                  const numeric = parseFloat(value) || 0
                  return (
                    <div key={varName} style={S.row}>
                      <span style={S.varLabel}>{varName}</span>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.125"
                        value={numeric}
                        aria-label={varName}
                        style={S.rangeInput}
                        onChange={(e) => handleRadiusChange(varName, e.target.value)}
                      />
                      <span style={S.rangeValue}>{value}</span>
                    </div>
                  )
                }

                const hex = oklchToHex(value)
                const colorInputId = `panel-color-${varName.replace(/^--/, '')}`
                const textInputId = `panel-oklch-${varName.replace(/^--/, '')}`

                return (
                  <div key={varName} style={S.row}>
                    <label htmlFor={colorInputId} style={S.varLabel}>
                      {varName}
                    </label>
                    <span style={{ ...S.swatch, backgroundColor: value }} aria-hidden="true" />
                    <input
                      id={colorInputId}
                      type="color"
                      value={hex.startsWith('#') ? hex : '#000000'}
                      style={S.colorInput}
                      onChange={(e) => handleColorChange(varName, e.target.value)}
                    />
                    <label
                      htmlFor={textInputId}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    >
                      {varName} OKLCH value
                    </label>
                    <input
                      id={textInputId}
                      type="text"
                      value={value}
                      style={S.textInput}
                      onChange={(e) => handleTextChange(varName, e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

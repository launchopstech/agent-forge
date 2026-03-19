'use client'

import React, { useCallback, useState } from 'react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'
import { Button } from '../button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'
import { cn } from '../utils'
import { oklchToHex, hexToOklch } from './color-utils'
import { THEME_GROUPS, DEFAULT_LIGHT_VARS, DEFAULT_DARK_VARS } from './constants'
import { THEME_PRESETS } from './presets'

export type ThemeEditorProps = {
  lightVars: Record<string, string>
  darkVars: Record<string, string>
  mode: 'light' | 'dark'
  readOnly?: boolean
  onChange: (vars: Record<string, string>, mode: 'light' | 'dark') => void
  onReset: () => void
  onExport: () => void
  onSave?: () => void
}

function isRadiusVar(varName: string): boolean {
  return varName === '--radius'
}

export function ThemeEditor({
  lightVars,
  darkVars,
  mode,
  readOnly = false,
  onChange,
  onReset,
  onExport,
  onSave,
}: ThemeEditorProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(THEME_GROUPS.map((g) => [g.label, true]))
  )

  const activeVars = mode === 'light' ? lightVars : darkVars

  const handleColorChange = useCallback(
    (varName: string, hexValue: string) => {
      const oklch = hexToOklch(hexValue)
      const updated = { ...activeVars, [varName]: oklch }
      onChange(updated, mode)
    },
    [activeVars, mode, onChange]
  )

  const handleOklchChange = useCallback(
    (varName: string, value: string) => {
      const updated = { ...activeVars, [varName]: value }
      onChange(updated, mode)
    },
    [activeVars, mode, onChange]
  )

  const handleRadiusChange = useCallback(
    (varName: string, value: string) => {
      const updated = { ...activeVars, [varName]: `${value}rem` }
      onChange(updated, mode)
    },
    [activeVars, mode, onChange]
  )

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }, [])

  const handlePresetSelect = useCallback(
    (key: string) => {
      const preset = THEME_PRESETS[key]
      if (!preset) return

      const toOklchVars = (raw: Record<string, string>) =>
        Object.fromEntries(
          Object.entries(raw).map(([k, v]) => [
            `--${k}`,
            k === 'radius' ? v : v.startsWith('#') ? hexToOklch(v) : v,
          ])
        )

      // Call the non-active mode first, then the active mode last so the
      // parent's mode state remains on the currently-viewed mode.
      if (mode === 'light') {
        onChange({ ...DEFAULT_DARK_VARS, ...toOklchVars(preset.dark) }, 'dark')
        onChange({ ...DEFAULT_LIGHT_VARS, ...toOklchVars(preset.light) }, 'light')
      } else {
        onChange({ ...DEFAULT_LIGHT_VARS, ...toOklchVars(preset.light) }, 'light')
        onChange({ ...DEFAULT_DARK_VARS, ...toOklchVars(preset.dark) }, 'dark')
      }
    },
    [mode, onChange]
  )

  return (
    <div className="flex flex-col gap-2">
      {/* Preset selector */}
      <div className="flex items-center gap-2 pb-2">
        <span className="shrink-0 text-xs text-muted-foreground">Preset</span>
        <Select onValueChange={handlePresetSelect} disabled={readOnly}>
          <SelectTrigger className="h-8 flex-1 text-xs">
            <SelectValue placeholder="Select preset…" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant="outline"
          size="sm"
          aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          onClick={() =>
            onChange(mode === 'light' ? darkVars : lightVars, mode === 'light' ? 'dark' : 'light')
          }
          disabled={readOnly}
        >
          {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="ml-1 capitalize">{mode}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} disabled={readOnly}>
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          Export CSS
        </Button>
        {onSave && (
          <Button size="sm" onClick={onSave} disabled={readOnly}>
            Save
          </Button>
        )}
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-1">
        {THEME_GROUPS.map((group) => (
          <Collapsible
            key={group.label}
            open={openGroups[group.label]}
            onOpenChange={() => toggleGroup(group.label)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm font-medium hover:bg-muted">
              <span>{group.label}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  openGroups[group.label] && 'rotate-180'
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2">
              <div className="flex flex-col gap-2 pt-1">
                {group.vars.map((varName) => {
                  const value = activeVars[varName] ?? ''

                  if (isRadiusVar(varName)) {
                    const numericValue = parseFloat(value) || 0
                    const inputId = `range-${varName.replace(/^--/, '')}`
                    return (
                      <div key={varName} className="flex items-center gap-2">
                        <label
                          htmlFor={inputId}
                          className="w-40 shrink-0 text-xs text-muted-foreground"
                        >
                          {varName}
                        </label>
                        <input
                          id={inputId}
                          type="range"
                          min="0"
                          max="2"
                          step="0.125"
                          value={numericValue}
                          disabled={readOnly}
                          aria-label={varName}
                          onChange={(e) => handleRadiusChange(varName, e.target.value)}
                          className="flex-1"
                        />
                        <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                          {value}
                        </span>
                      </div>
                    )
                  }

                  const hexValue = oklchToHex(value)
                  const colorInputId = `color-${varName.replace(/^--/, '')}`
                  const textInputId = `oklch-${varName.replace(/^--/, '')}`

                  return (
                    <div key={varName} className="flex items-center gap-2">
                      <label
                        htmlFor={colorInputId}
                        className="w-40 shrink-0 text-xs text-muted-foreground"
                      >
                        {varName}
                      </label>
                      {/* Color swatch + picker */}
                      <div
                        className="h-6 w-6 shrink-0 rounded border border-border"
                        style={{ backgroundColor: value }}
                        aria-hidden="true"
                      />
                      <input
                        id={colorInputId}
                        type="color"
                        value={hexValue.startsWith('#') ? hexValue : '#000000'}
                        disabled={readOnly}
                        onChange={(e) => handleColorChange(varName, e.target.value)}
                        className="h-6 w-8 cursor-pointer rounded border-0 p-0 disabled:cursor-not-allowed"
                      />
                      {/* Raw OKLCH text input */}
                      <label htmlFor={textInputId} className="sr-only">
                        {varName} OKLCH value
                      </label>
                      <input
                        id={textInputId}
                        type="text"
                        value={value}
                        disabled={readOnly}
                        onChange={(e) => handleOklchChange(varName, e.target.value)}
                        className="min-w-0 flex-1 rounded border border-border bg-background px-2 py-0.5 font-mono text-xs disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

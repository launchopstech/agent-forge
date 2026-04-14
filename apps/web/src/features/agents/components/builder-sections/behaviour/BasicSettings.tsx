'use client'

import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Label } from '@forge/ui/src/label'
import { Switch } from '@forge/ui/src/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { Slider } from '@forge/ui/src/slider'
import { useAgentBuilderStore } from '../../../store/agent-builder.store'

export const BasicSettings = React.memo(function BasicSettings() {
  const t = useTranslations('agentHub.builder.behaviour')
  const { draftAgent, updateBehaviour } = useAgentBuilderStore()
  const { useEmojis, showSourceLinks, responseStyle, fallback } = draftAgent.behaviour

  const handleEmojisChange = useCallback(
    (checked: boolean) => {
      updateBehaviour({ useEmojis: checked })
    },
    [updateBehaviour]
  )

  const handleSourceLinksChange = useCallback(
    (checked: boolean) => {
      updateBehaviour({ showSourceLinks: checked })
    },
    [updateBehaviour]
  )

  const handleStyleChange = useCallback(
    ([val]: number[]) => {
      updateBehaviour({ responseStyle: val })
    },
    [updateBehaviour]
  )

  const handleFallbackChange = useCallback(
    (val: string) => {
      updateBehaviour({ fallback: val as typeof fallback })
    },
    [updateBehaviour]
  )

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{t('basicSettingsLabel')}</Label>

      <div className="space-y-3 rounded-lg border p-4">
        {/* Emojis toggle */}
        <div className="flex items-center justify-between min-h-[48px]">
          <div>
            <div className="text-sm font-medium">{t('useEmojisLabel')}</div>
            <div className="text-xs text-muted-foreground">{t('useEmojisHint')}</div>
          </div>
          <Switch checked={useEmojis} onCheckedChange={handleEmojisChange} />
        </div>

        <div className="border-t" />

        {/* Source links toggle */}
        <div className="flex items-center justify-between min-h-[48px]">
          <div>
            <div className="text-sm font-medium">{t('showSourceLinksLabel')}</div>
            <div className="text-xs text-muted-foreground">{t('showSourceLinksHint')}</div>
          </div>
          <Switch checked={showSourceLinks} onCheckedChange={handleSourceLinksChange} />
        </div>

        <div className="border-t" />

        {/* Fallback strategy */}
        <div className="space-y-2 pt-1">
          <Label htmlFor="fallback" className="text-sm font-medium">
            {t('fallbackLabel')}
          </Label>
          <Select value={fallback} onValueChange={handleFallbackChange}>
            <SelectTrigger id="fallback">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="handoff">{t('fallbackHandoff')}</SelectItem>
              <SelectItem value="ticket">{t('fallbackTicket')}</SelectItem>
              <SelectItem value="email">{t('fallbackEmail')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t('fallbackHint')}</p>
        </div>
      </div>

      {/* Response style */}
      <div className="space-y-3">
        <Label>{t('responseStyleLabel')}</Label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground shrink-0">{t('styleConcise')}</span>
          <Slider
            value={[responseStyle]}
            onValueChange={handleStyleChange}
            min={0}
            max={100}
            step={10}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground shrink-0">{t('styleDetailed')}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('responseStyleValue', { value: responseStyle })}
        </p>
      </div>
    </div>
  )
})

'use client'

import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Label } from '@forge/ui/src/label'
import { Textarea } from '@forge/ui/src/textarea'
import { cn } from '@forge/ui/src/utils'
import { useAgentBuilderStore } from '../../../store/agent-builder.store'
import type { TonePreset } from '../../../types'

const TONE_PRESETS: TonePreset[] = ['neutral', 'friendly', 'formal', 'custom']

export const TonePresetSelector = React.memo(function TonePresetSelector() {
  const t = useTranslations('agentHub.builder.behaviour')
  const { draftAgent, updateBehaviour } = useAgentBuilderStore()
  const { tonePreset, customToneInstructions } = draftAgent.behaviour

  const handleToneChange = useCallback(
    (preset: TonePreset) => {
      updateBehaviour({ tonePreset: preset })
    },
    [updateBehaviour]
  )

  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateBehaviour({ customToneInstructions: e.target.value })
    },
    [updateBehaviour]
  )

  const toneLabels: Record<TonePreset, string> = {
    neutral: t('toneNeutral'),
    friendly: t('toneFriendly'),
    formal: t('toneFormal'),
    custom: t('toneCustom'),
  }

  const toneDescriptions: Record<Exclude<TonePreset, 'custom'>, string> = {
    neutral: t('toneNeutralDesc'),
    friendly: t('toneFriendlyDesc'),
    formal: t('toneFormalDesc'),
  }

  return (
    <div className="space-y-3">
      <Label>{t('toneLabel')}</Label>
      <div className="flex flex-wrap gap-2">
        {TONE_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleToneChange(preset)}
            className={cn(
              'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
              tonePreset === preset
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-transparent text-muted-foreground border-border hover:bg-muted'
            )}
          >
            {toneLabels[preset]}
          </button>
        ))}
      </div>

      {tonePreset !== 'custom' && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 leading-relaxed">
          {toneDescriptions[tonePreset]}
        </p>
      )}

      {tonePreset === 'custom' && (
        <Textarea
          value={customToneInstructions}
          onChange={handleCustomChange}
          placeholder={t('customTonePlaceholder')}
          rows={3}
          className="text-sm"
        />
      )}
    </div>
  )
})

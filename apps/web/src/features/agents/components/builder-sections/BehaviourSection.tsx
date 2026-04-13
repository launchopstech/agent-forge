'use client'

import { useTranslations } from 'next-intl'
import { TonePresetSelector } from './behaviour/TonePresetSelector'
import { BasicSettings } from './behaviour/BasicSettings'
import { GuidanceRulesList } from './behaviour/GuidanceRulesList'
import { AdvancedSection } from './behaviour/AdvancedSection'

export function BehaviourSection() {
  const t = useTranslations('agentHub.builder.behaviour')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-lg">
        <TonePresetSelector />
        <BasicSettings />
        <GuidanceRulesList />
        <AdvancedSection />
      </div>
    </div>
  )
}

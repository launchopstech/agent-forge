'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@forge/ui/src/button'
import { Switch } from '@forge/ui/src/switch'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

const AVAILABLE_KNOWLEDGE = [
  { name: 'Product Docs', emoji: '📘', description: 'Technical documentation and guides' },
  { name: 'FAQ Database', emoji: '❓', description: 'Frequently asked questions and answers' },
  { name: 'Pricing & Plans', emoji: '💳', description: 'Current pricing tiers and features' },
  { name: 'Product Overview', emoji: '🗂️', description: 'High-level product descriptions' },
  { name: 'Case Studies', emoji: '📊', description: 'Customer success stories' },
  { name: 'Order Policies', emoji: '📋', description: 'Order terms and conditions' },
  { name: 'Return Policy', emoji: '🔄', description: 'Returns and exchanges policy' },
  { name: 'Shipping Info', emoji: '🚚', description: 'Delivery times and carriers' },
  { name: 'Getting Started Guide', emoji: '🚀', description: 'Onboarding and setup instructions' },
  { name: 'Feature Docs', emoji: '✨', description: 'Detailed feature documentation' },
  { name: 'Video Tutorials', emoji: '🎬', description: 'Step-by-step video walkthroughs' },
  { name: 'IT Policies', emoji: '🔒', description: 'IT security and usage policies' },
  { name: 'Common Issues', emoji: '🔧', description: 'Known issues and troubleshooting steps' },
  { name: 'Software Guides', emoji: '💻', description: 'Software setup and configuration guides' },
]

export function KnowledgeSection() {
  const t = useTranslations('agentHub.builder.knowledge')
  const tCommon = useTranslations('agentHub.builder')
  const router = useRouter()
  const { draftAgent, toggleKnowledge, markSectionCompleted, agentId } = useAgentBuilderStore()
  const { knowledge } = draftAgent
  const builderBase = `/agents/${agentId ?? 'new'}`

  const handleNext = useCallback(() => {
    markSectionCompleted('knowledge')
    router.push(`${builderBase}/channels`)
  }, [markSectionCompleted, router, builderBase])

  const handleBack = useCallback(() => {
    router.push(`${builderBase}/actions`)
  }, [router, builderBase])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="max-w-lg space-y-2">
        {AVAILABLE_KNOWLEDGE.map((source) => (
          <div
            key={source.name}
            className="flex items-center gap-3 p-3 border rounded-xl bg-card min-h-[48px] select-none"
          >
            <span className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-base flex-shrink-0">
              {source.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{source.name}</p>
              <p className="text-xs text-muted-foreground">{source.description}</p>
            </div>
            <Switch
              id={`knowledge-${source.name}`}
              checked={knowledge.includes(source.name)}
              onCheckedChange={() => toggleKnowledge(source.name)}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {t('selectedCount', { count: knowledge.length })}
      </p>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {tCommon('back')}
        </Button>
        <Button onClick={handleNext}>{tCommon('next')}</Button>
      </div>
    </div>
  )
}

'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@forge/ui/src/button'
import { Switch } from '@forge/ui/src/switch'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

const AVAILABLE_ACTIONS = [
  { name: 'Process Refund', emoji: '💰', description: 'Initiate and process customer refunds' },
  { name: 'Book Meeting', emoji: '📅', description: 'Schedule meetings with team members' },
  { name: 'Create Ticket', emoji: '🎫', description: 'Open support tickets in your help desk' },
  { name: 'Book Demo', emoji: '🎯', description: 'Schedule product demos with prospects' },
  { name: 'Send Brochure', emoji: '📄', description: 'Email product brochures to contacts' },
  { name: 'Create Lead', emoji: '🌱', description: 'Add new leads to your CRM' },
  { name: 'Track Order', emoji: '📦', description: 'Look up order status and shipping info' },
  { name: 'Process Return', emoji: '↩️', description: 'Handle product return requests' },
  { name: 'Update Address', emoji: '📍', description: 'Update customer shipping addresses' },
  { name: 'Schedule Call', emoji: '📞', description: 'Book callback appointments' },
  { name: 'Send Tutorial', emoji: '🎓', description: 'Share onboarding and how-to content' },
  { name: 'Create Account', emoji: '👤', description: 'Provision new customer accounts' },
  { name: 'Create IT Ticket', emoji: '🖥️', description: 'Log IT issues and requests' },
  { name: 'Reset Password', emoji: '🔑', description: 'Trigger password reset flows' },
  { name: 'Escalate Issue', emoji: '🚨', description: 'Escalate to a human agent' },
]

export function ActionsSection() {
  const t = useTranslations('agentHub.builder.actions')
  const tCommon = useTranslations('agentHub.builder')
  const router = useRouter()
  const { draftAgent, toggleAction, markSectionCompleted, agentId } = useAgentBuilderStore()
  const { actions } = draftAgent
  const builderBase = `/agents/${agentId ?? 'new'}`

  const handleNext = useCallback(() => {
    markSectionCompleted('actions')
    router.push(`${builderBase}/knowledge`)
  }, [markSectionCompleted, router, builderBase])

  const handleBack = useCallback(() => {
    router.push(`${builderBase}/behaviour`)
  }, [router, builderBase])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="max-w-lg space-y-2">
        {AVAILABLE_ACTIONS.map((action) => (
          <div
            key={action.name}
            className="flex items-center gap-3 p-3 border rounded-xl bg-card min-h-[48px] select-none"
          >
            <span className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-base flex-shrink-0">
              {action.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{action.name}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
            <Switch
              id={`action-${action.name}`}
              checked={actions.includes(action.name)}
              onCheckedChange={() => toggleAction(action.name)}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {t('selectedCount', { count: actions.length })}
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

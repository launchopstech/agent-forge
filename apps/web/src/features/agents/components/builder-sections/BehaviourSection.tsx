'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Label } from '@forge/ui/src/label'
import { Textarea } from '@forge/ui/src/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { Slider } from '@forge/ui/src/slider'
import { Alert, AlertDescription } from '@forge/ui/src/alert'
import { Button } from '@forge/ui/src/button'
import { Lightbulb } from 'lucide-react'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

export function BehaviourSection() {
  const t = useTranslations('agentHub.builder.behaviour')
  const tCommon = useTranslations('agentHub.builder')
  const router = useRouter()
  const { draftAgent, updateBehaviour, markSectionCompleted, agentId } = useAgentBuilderStore()
  const { behaviour } = draftAgent
  const builderBase = `/agents/${agentId ?? 'new'}`

  const handleNext = useCallback(() => {
    markSectionCompleted('behaviour')
    router.push(`${builderBase}/actions`)
  }, [markSectionCompleted, router, builderBase])

  const handleBack = useCallback(() => {
    router.push(`${builderBase}/identity`)
  }, [router, builderBase])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="system-prompt">{t('systemPromptLabel')}</Label>
          <Alert className="bg-primary/5 border-primary/20 [&>svg]:text-primary">
            <Lightbulb className="size-4" />
            <AlertDescription className="text-primary text-xs">
              {t('systemPromptTip')}
            </AlertDescription>
          </Alert>
          <Textarea
            id="system-prompt"
            value={behaviour.systemPrompt}
            onChange={(e) => updateBehaviour({ systemPrompt: e.target.value })}
            placeholder={t('systemPromptPlaceholder')}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-3">
          <Label>{t('responseStyleLabel')}</Label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground shrink-0">{t('styleConcise')}</span>
            <Slider
              value={[behaviour.responseStyle]}
              onValueChange={([val]) => updateBehaviour({ responseStyle: val })}
              min={0}
              max={100}
              step={10}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground shrink-0">{t('styleDetailed')}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('responseStyleValue', { value: behaviour.responseStyle })}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fallback">{t('fallbackLabel')}</Label>
          <Select
            value={behaviour.fallback}
            onValueChange={(val) => updateBehaviour({ fallback: val as typeof behaviour.fallback })}
          >
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

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {tCommon('back')}
        </Button>
        <Button onClick={handleNext}>{tCommon('next')}</Button>
      </div>
    </div>
  )
}

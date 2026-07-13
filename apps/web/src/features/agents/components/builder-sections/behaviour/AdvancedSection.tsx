'use client'

import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Lightbulb } from 'lucide-react'
import { Label } from '@forge/ui/src/label'
import { Textarea } from '@forge/ui/src/textarea'
import { Alert, AlertDescription } from '@forge/ui/src/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@forge/ui/src/accordion'
import { useAgentBuilderStore } from '../../../store/agent-builder.store'

export const AdvancedSection = React.memo(function AdvancedSection() {
  const t = useTranslations('agentHub.builder.behaviour')
  const { draftAgent, updateBehaviour } = useAgentBuilderStore()
  const { systemPrompt } = draftAgent.behaviour

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateBehaviour({ systemPrompt: e.target.value })
    },
    [updateBehaviour]
  )

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="advanced" className="border rounded-lg px-4">
        <AccordionTrigger className="py-3 hover:no-underline">
          <div className="flex items-center justify-between w-full pr-2">
            <span className="text-sm font-medium">{t('advancedLabel')}</span>
            <span className="text-xs text-muted-foreground">{t('advancedHint')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3">
            <Label htmlFor="system-prompt">{t('systemPromptLabel')}</Label>
            <Alert className="bg-primary/5 border-primary/20 [&>svg]:text-primary">
              <Lightbulb className="size-4" />
              <AlertDescription className="text-primary text-xs">
                {t('systemPromptTip')}
              </AlertDescription>
            </Alert>
            <Textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={handleChange}
              placeholder={t('systemPromptPlaceholder')}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
})

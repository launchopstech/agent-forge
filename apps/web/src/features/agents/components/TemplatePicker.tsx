'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Card, CardContent } from '@forge/ui/src/card'
import { Badge } from '@forge/ui/src/badge'
import { Skeleton } from '@forge/ui/src/skeleton'
import { Separator } from '@forge/ui/src/separator'
import { cn } from '@forge/ui/src/utils'
import { fetchTemplates } from '../api/templates.api'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { AgentTemplate } from '../types'

export const TemplatePicker = React.memo(function TemplatePicker() {
  const t = useTranslations('agentHub.templates')
  const router = useRouter()
  const applyTemplate = useAgentBuilderStore((s) => s.applyTemplate)
  const resetDraft = useAgentBuilderStore((s) => s.resetDraft)

  const [templates, setTemplates] = useState<AgentTemplate[]>([])
  const [selected, setSelected] = useState<AgentTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void fetchTemplates().then((data) => {
      setTemplates(data)
      setIsLoading(false)
    })
  }, [])

  const handleSelect = useCallback((template: AgentTemplate) => {
    setSelected(template)
  }, [])

  const handleContinue = useCallback(() => {
    if (!selected) return
    resetDraft()
    applyTemplate(selected)
    // agentId='new' resolves to /agents/[agentId]/[section] with agentId="new"
    router.push('/agents/new/identity')
  }, [applyTemplate, resetDraft, router, selected])

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Template grid */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    selected?.id === template.id && 'ring-2 ring-primary'
                  )}
                  onClick={() => handleSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 text-3xl">{template.emoji}</div>
                    <div className="font-semibold">{template.name}</div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs capitalize">
                      {template.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div className="w-72 shrink-0">
          {selected ? (
            <div className="sticky top-0 space-y-4 rounded-xl border p-4">
              <div>
                <div className="text-3xl">{selected.emoji}</div>
                <h2 className="mt-2 text-lg font-semibold">{selected.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {t('previewActions')}
                  </div>
                  {selected.actions.length > 0 ? (
                    <ul className="space-y-1">
                      {selected.actions.map((a) => (
                        <li key={a} className="text-sm">
                          • {a}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">{t('none')}</span>
                  )}
                </div>

                <div>
                  <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {t('previewKnowledge')}
                  </div>
                  {selected.knowledge.length > 0 ? (
                    <ul className="space-y-1">
                      {selected.knowledge.map((k) => (
                        <li key={k} className="text-sm">
                          • {k}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">{t('none')}</span>
                  )}
                </div>

                <div>
                  <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {t('previewChannels')}
                  </div>
                  {selected.channels.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selected.channels.map((ch) => (
                        <Badge key={ch} variant="secondary" className="capitalize text-xs">
                          {ch}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{t('none')}</span>
                  )}
                </div>
              </div>

              <Button className="w-full" onClick={handleContinue}>
                {t('useTemplate')}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground text-sm">
              {t('selectToPreview')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

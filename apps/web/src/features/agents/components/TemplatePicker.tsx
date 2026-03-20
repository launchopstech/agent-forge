'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Skeleton } from '@forge/ui/src/skeleton'
import { cn } from '@forge/ui/src/utils'
import { siteConfig } from '@/config'
import { fetchTemplates } from '../api/templates.api'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { AgentTemplate } from '../types'

/** Split a name into [prefix, accent] for two-tone rendering */
function splitName(name: string, accent?: string): [string, string] {
  if (!accent) return [name.toLowerCase(), '']
  const lower = name.toLowerCase()
  const idx = lower.lastIndexOf(accent.toLowerCase())
  return idx === -1 ? [lower, ''] : [lower.slice(0, idx), lower.slice(idx)]
}

/** Count how many builder sections this template pre-fills */
function sectionCount(tpl: AgentTemplate): number {
  let count = 0
  if (tpl.identity.name) count++
  if (tpl.behaviour.systemPrompt) count++
  if (tpl.actions.length > 0) count++
  if (tpl.knowledge.length > 0) count++
  if (tpl.channels.length > 0) count++
  return count
}

const EMOJI_BG: Record<string, string> = {
  'customer-support': 'bg-blue-50 dark:bg-blue-950/30',
  'lead-qualifier': 'bg-green-50 dark:bg-green-950/30',
  'order-assistant': 'bg-amber-50 dark:bg-amber-950/30',
  'user-onboarding': 'bg-violet-50 dark:bg-violet-950/30',
  'it-helpdesk': 'bg-red-50 dark:bg-red-950/30',
  blank: 'bg-muted',
}

const CATEGORY_KEYS = ['all', 'support', 'sales', 'ecommerce', 'onboarding'] as const

const CATEGORY_I18N: Record<(typeof CATEGORY_KEYS)[number], string> = {
  all: 'categoryAll',
  support: 'categorySupport',
  sales: 'categorySales',
  ecommerce: 'categoryEcommerce',
  onboarding: 'categoryOnboarding',
}

export const TemplatePicker = React.memo(function TemplatePicker() {
  const t = useTranslations('agentHub.templates')
  const tSidebar = useTranslations('sidebar')
  const router = useRouter()
  const applyTemplate = useAgentBuilderStore((s) => s.applyTemplate)
  const resetDraft = useAgentBuilderStore((s) => s.resetDraft)

  const [templates, setTemplates] = useState<AgentTemplate[]>([])
  const [selected, setSelected] = useState<AgentTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const [prefix, accent] = splitName(siteConfig.name, siteConfig.nameAccent)
  const ws = siteConfig.workspaceName

  useEffect(() => {
    void fetchTemplates().then((data) => {
      setTemplates(data)
      setIsLoading(false)
    })
  }, [])

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates
    return templates.filter((tpl) => tpl.category === activeCategory || tpl.category === 'blank')
  }, [templates, activeCategory])

  const handleSelect = useCallback((template: AgentTemplate) => {
    setSelected(template)
  }, [])

  const handleContinue = useCallback(() => {
    if (!selected) return
    resetDraft()
    applyTemplate(selected)
    router.push('/agents/new/identity')
  }, [applyTemplate, resetDraft, router, selected])

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category)
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Secondary header — brand + workspace */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold tracking-tight text-sm select-none shrink-0">
            <span className="text-foreground">{prefix}</span>
            {accent && <span className="text-primary">{accent}</span>}
          </span>
          {ws && (
            <>
              <span className="h-4 w-px bg-border mx-1 shrink-0" aria-hidden="true" />
              <span className="text-sm text-muted-foreground truncate">
                {tSidebar('workspaceLabel')}:{' '}
                <span className="font-medium text-foreground">{ws}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Category filter bar */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_KEYS.map((cat) => (
          <Button
            key={cat}
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 rounded-full text-xs',
              activeCategory === cat && 'bg-primary/10 text-primary hover:bg-primary/15'
            )}
            onClick={() => handleCategoryChange(cat)}
          >
            {t(CATEGORY_I18N[cat])}
          </Button>
        ))}
      </div>

      {/* Grid + Preview */}
      <div className="flex gap-6">
        {/* Template grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const isBlank = template.category === 'blank'
                const isSelected = selected?.id === template.id

                return (
                  <button
                    key={template.id}
                    type="button"
                    className={cn(
                      'border-2 rounded-xl p-4 text-left cursor-pointer transition-all',
                      'hover:border-primary/50 hover:shadow-sm',
                      isSelected && 'border-primary bg-primary/5 shadow-sm',
                      isBlank && !isSelected && 'border-dashed',
                      !isSelected && !isBlank && 'border-border'
                    )}
                    onClick={() => handleSelect(template)}
                  >
                    <div
                      className={cn(
                        'size-9 rounded-xl flex items-center justify-center text-lg mb-2.5',
                        EMOJI_BG[template.id] ?? 'bg-muted'
                      )}
                    >
                      {template.emoji}
                    </div>
                    <div className="text-sm font-semibold">{template.name}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {template.description}
                    </p>
                  </button>
                )
              })}
            </div>
          )}

          {/* Mobile/tablet: action button when selected */}
          {selected && (
            <div className="mt-4 lg:hidden">
              <Button className="w-full" onClick={handleContinue}>
                {t('useTemplate')}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview panel — desktop only */}
        <div className="hidden lg:block w-72 shrink-0">
          {selected ? (
            <div className="sticky top-6 flex max-h-[calc(100vh-6rem)] flex-col rounded-xl border">
              {/* Header — pinned top */}
              <div className="flex items-center gap-3 border-b p-3 shrink-0">
                <div
                  className={cn(
                    'size-11 rounded-full flex items-center justify-center text-xl shrink-0',
                    EMOJI_BG[selected.id] ?? 'bg-muted'
                  )}
                >
                  {selected.emoji}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold truncate">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {t('prefillsSections', { count: sectionCount(selected) })}
                  </p>
                </div>
              </div>

              {/* Scrollable section cards */}
              <div className="flex-1 overflow-y-auto overscroll-contain space-y-3 p-3">
                {/* Identity card */}
                <div className="rounded-xl border p-3 space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    👤 {t('previewIdentity')}
                  </div>
                  <div className="text-sm">
                    {t('botName')}: {selected.identity.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('welcomeAndTone')}</div>
                </div>

                {/* Behaviour card */}
                {selected.behaviour.systemPrompt && (
                  <div className="rounded-xl border p-3 space-y-1.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      🧠 {t('previewBehaviour')}
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5 text-xs leading-relaxed">
                      {selected.behaviour.systemPrompt}
                    </div>
                  </div>
                )}

                {/* Actions card */}
                {selected.actions.length > 0 && (
                  <div className="rounded-xl border p-3 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      ⚡ {t('previewActions')}
                    </div>
                    <div className="text-sm">{selected.actions.join(' · ')}</div>
                  </div>
                )}

                {/* Knowledge card */}
                {selected.knowledge.length > 0 && (
                  <div className="rounded-xl border p-3 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      📚 {t('previewKnowledge')}
                    </div>
                    <div className="text-sm">{selected.knowledge.join(' · ')}</div>
                  </div>
                )}
              </div>

              {/* CTA — pinned bottom */}
              <div className="border-t p-3 space-y-1.5 shrink-0">
                <Button className="w-full" onClick={handleContinue}>
                  {t('useTemplateNamed', { name: selected.name })}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">{t('noExtraSteps')}</p>
              </div>
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

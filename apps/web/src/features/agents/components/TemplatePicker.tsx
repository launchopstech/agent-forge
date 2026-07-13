'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Progress } from '@forge/ui/src/progress'
import { Skeleton } from '@forge/ui/src/skeleton'
import { cn } from '@forge/ui/src/utils'
import { siteConfig } from '@/config'
import { fetchAgentTypes } from '../api/agent-types.api'
import { fetchTemplates } from '../api/templates.api'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { AgentTemplate, AgentType } from '../types'

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
  if ((tpl.knowledgeSources?.length ?? tpl.knowledge.length) > 0) count++
  if (tpl.channels.length > 0) count++
  return count
}

function templateKnowledgeNames(template: AgentTemplate): string[] {
  return template.knowledgeSources?.map((source) => source.name) ?? template.knowledge
}

const EMOJI_BG: Record<string, string> = {
  'customer-support': 'bg-blue-50 dark:bg-blue-950/30',
  'lead-qualifier': 'bg-green-50 dark:bg-green-950/30',
  'order-assistant': 'bg-amber-50 dark:bg-amber-950/30',
  'user-onboarding': 'bg-violet-50 dark:bg-violet-950/30',
  'it-helpdesk': 'bg-red-50 dark:bg-red-950/30',
  'appointment-scheduler': 'bg-cyan-50 dark:bg-cyan-950/30',
  'product-recommender': 'bg-orange-50 dark:bg-orange-950/30',
  'faq-bot': 'bg-teal-50 dark:bg-teal-950/30',
  'survey-collector': 'bg-purple-50 dark:bg-purple-950/30',
  'billing-assistant': 'bg-emerald-50 dark:bg-emerald-950/30',
  'social-media-manager': 'bg-pink-50 dark:bg-pink-950/30',
  'hr-assistant': 'bg-indigo-50 dark:bg-indigo-950/30',
  'travel-planner': 'bg-sky-50 dark:bg-sky-950/30',
  'code-reviewer': 'bg-slate-50 dark:bg-slate-950/30',
  'event-coordinator': 'bg-yellow-50 dark:bg-yellow-950/30',
  'inventory-tracker': 'bg-lime-50 dark:bg-lime-950/30',
  'compliance-checker': 'bg-stone-50 dark:bg-stone-950/30',
  'newsletter-writer': 'bg-rose-50 dark:bg-rose-950/30',
  blank: 'bg-muted',
}

export const TemplatePicker = React.memo(function TemplatePicker() {
  const t = useTranslations('agentHub.templates')
  const tSidebar = useTranslations('sidebar')
  const router = useRouter()
  const applyTemplate = useAgentBuilderStore((s) => s.applyTemplate)
  const resetDraft = useAgentBuilderStore((s) => s.resetDraft)

  const [templates, setTemplates] = useState<AgentTemplate[]>([])
  const [agentTypes, setAgentTypes] = useState<AgentType[]>([])
  const [selected, setSelected] = useState<AgentTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [prefix, accent] = splitName(siteConfig.name, siteConfig.nameAccent)
  const ws = siteConfig.workspaceName

  useEffect(() => {
    void Promise.all([fetchTemplates(), fetchAgentTypes()]).then(([templateData, typeData]) => {
      setTemplates(templateData)
      setAgentTypes(typeData)
      setIsLoading(false)
    })
  }, [])

  const filteredTemplates = useMemo(() => {
    let result = templates
    if (activeCategory !== 'all') {
      result = result.filter((tpl) => tpl.agentType === activeCategory)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (tpl) =>
          tpl.name.toLowerCase().includes(query) || tpl.description.toLowerCase().includes(query)
      )
    }
    return result
  }, [templates, activeCategory, searchQuery])

  const handleSelect = useCallback((template: AgentTemplate) => {
    setSelected(template)
  }, [])

  const handleContinue = useCallback(() => {
    if (!selected) return
    resetDraft()
    applyTemplate(selected)
    router.push('/agents/new/identity')
  }, [applyTemplate, resetDraft, router, selected])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category)
  }, [])

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden sm:gap-4">
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

      {/* Step indicator + heading */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {t('stepIndicator', { step: 1, total: 3 })}
          </p>
          <Progress value={33} className="h-1 flex-1" />
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t('title')}</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">{t('subtitle')}</p>
      </div>

      {/* Category filter bar */}
      <div className="flex flex-wrap gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-7 rounded-full text-xs',
            activeCategory === 'all' && 'bg-primary/10 text-primary hover:bg-primary/15'
          )}
          onClick={() => handleCategoryChange('all')}
        >
          {t('categoryAll')}
        </Button>
        {agentTypes.map((agentType) => (
          <Button
            key={agentType.slug}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 rounded-full text-xs',
              activeCategory === agentType.slug && 'bg-primary/10 text-primary hover:bg-primary/15'
            )}
            onClick={() => handleCategoryChange(agentType.slug)}
          >
            <span aria-hidden="true">{agentType.emoji}</span>
            {agentType.name}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9 [&]:appearance-none"
        />
      </div>

      {/* Grid + Preview — scrollable area */}
      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden lg:gap-6">
        {/* Template grid */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl sm:h-32" />
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {t('noResults')}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const isBlank = template.agentType === 'custom'
                const isSelected = selected?.id === template.id

                return (
                  <button
                    key={template.id}
                    type="button"
                    className={cn(
                      'border-2 rounded-xl p-3 sm:p-4 text-left cursor-pointer transition-all',
                      'hover:border-primary/50 hover:shadow-sm',
                      isSelected && 'border-primary bg-primary/5 shadow-sm',
                      isBlank && !isSelected && 'border-dashed',
                      !isSelected && !isBlank && 'border-border'
                    )}
                    onClick={() => handleSelect(template)}
                  >
                    <div
                      className={cn(
                        'size-8 sm:size-9 rounded-xl flex items-center justify-center text-base sm:text-lg mb-2',
                        EMOJI_BG[template.id] ?? 'bg-muted'
                      )}
                    >
                      {template.emoji}
                    </div>
                    <div className="text-xs font-semibold sm:text-sm">{template.name}</div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 sm:text-xs sm:mt-1">
                      {template.description}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Preview panel — desktop only */}
        <div className="hidden lg:flex w-72 shrink-0 flex-col overflow-hidden">
          {selected ? (
            <div className="flex max-h-full flex-col rounded-xl border">
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
                {templateKnowledgeNames(selected).length > 0 && (
                  <div className="rounded-xl border p-3 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      📚 {t('previewKnowledge')}
                    </div>
                    <div className="text-sm">{templateKnowledgeNames(selected).join(' · ')}</div>
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

      {/* Mobile/tablet: sticky CTA */}
      {selected && (
        <div className="shrink-0 border-t pt-3 lg:hidden">
          <Button className="w-full" size="sm" onClick={handleContinue}>
            {t('useTemplateNamed', { name: selected.name })}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  )
})

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, FileText, Plus, RefreshCw, ShoppingBag, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Skeleton } from '@forge/ui/src/skeleton'
import { Switch } from '@forge/ui/src/switch'
import { Textarea } from '@forge/ui/src/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@forge/ui/src/tooltip'
import {
  createKnowledgeItem,
  deleteKnowledgeItem,
  fetchAgentKnowledgeSources,
  fetchKnowledgeItems,
  fetchKnowledgeSourceOptions,
  updateAgentKnowledgeSources,
  updateKnowledgeItem,
  type CreateKnowledgeItemPayload,
  type KnowledgeItem,
} from '../../api/knowledge.api'
import { useAgentBuilderStore } from '../../store/agent-builder.store'
import type { KnowledgeSourceOption } from '../../types'

type EditableKnowledgeItem = KnowledgeItem & { isDraft?: boolean }
type SetupMode = 'qa' | 'document' | 'integration'

function createDraftId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `draft-${crypto.randomUUID()}`
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function nextPosition(items: EditableKnowledgeItem[]): number {
  return items.reduce((max, item) => Math.max(max, item.position), -1) + 1
}

function setupModeFor(source: KnowledgeSourceOption): SetupMode {
  return source.uiSchema.setupMode ?? 'document'
}

function toPayload(item: EditableKnowledgeItem): CreateKnowledgeItemPayload | null {
  if (item.type === 'qa') {
    const question = item.question?.trim() ?? ''
    const answer = item.answer?.trim() ?? ''
    if (!question || !answer) return null
    return {
      type: 'qa',
      title: null,
      question,
      answer,
      content: null,
      sourceUrl: null,
      knowledgeSourceOptionId: item.knowledgeSourceOptionId ?? null,
      position: item.position,
    }
  }

  const content = item.content?.trim() ?? ''
  if (!content) return null
  return {
    type: item.type,
    title: item.title?.trim() || null,
    question: null,
    answer: null,
    content,
    sourceUrl: item.sourceUrl ?? null,
    knowledgeSourceOptionId: item.knowledgeSourceOptionId ?? null,
    position: item.position,
  }
}

export function KnowledgeSection() {
  const t = useTranslations('agentHub.builder.knowledge')
  const router = useRouter()
  const agentId = useAgentBuilderStore((state) => state.agentId)
  const agentType = useAgentBuilderStore((state) => state.draftAgent.agentType)
  const draftKnowledge = useAgentBuilderStore((state) => state.draftAgent.knowledge)
  const isDraftSaving = useAgentBuilderStore((state) => state.isSaving)
  const ensureDraftAgent = useAgentBuilderStore((state) => state.ensureDraftAgent)
  const toggleKnowledge = useAgentBuilderStore((state) => state.toggleKnowledge)
  const [sources, setSources] = useState<KnowledgeSourceOption[]>([])
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [items, setItems] = useState<EditableKnowledgeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [isAutoCreating, setIsAutoCreating] = useState(false)
  const [savingItemIds, setSavingItemIds] = useState<Set<string>>(new Set())
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const savingItemIdsRef = useRef<Set<string>>(new Set())
  const agentIdRef = useRef(agentId)
  const skipNextSavedLoad = useRef(false)
  const pendingFocusId = useRef<string | null>(null)
  const questionRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  const effectiveSelectedSlugs = agentId ? selectedSlugs : draftKnowledge
  const isCreatingDraft = isAutoCreating || (!agentId && isDraftSaving)

  const selectedSources = useMemo(
    () => sources.filter((source) => effectiveSelectedSlugs.includes(source.slug)),
    [sources, effectiveSelectedSlugs]
  )

  const clearSaveTimer = useCallback((itemId: string) => {
    const timer = saveTimers.current.get(itemId)
    if (timer) clearTimeout(timer)
    saveTimers.current.delete(itemId)
  }, [])

  const markItemSaving = useCallback((itemId: string, isSaving: boolean) => {
    const next = new Set(savingItemIdsRef.current)
    if (isSaving) next.add(itemId)
    else next.delete(itemId)
    savingItemIdsRef.current = next
    setSavingItemIds(next)
  }, [])

  const ensureSavedAgentId = useCallback(async () => {
    if (agentIdRef.current) return agentIdRef.current

    setIsAutoCreating(true)
    skipNextSavedLoad.current = true
    const draftSelectedSlugs = useAgentBuilderStore.getState().draftAgent.knowledge
    setSelectedSlugs(draftSelectedSlugs)
    try {
      const agent = await ensureDraftAgent()
      agentIdRef.current = agent.id
      setSelectedSlugs(draftSelectedSlugs)
      return agent.id
    } catch (err) {
      skipNextSavedLoad.current = false
      throw err
    } finally {
      setIsAutoCreating(false)
    }
  }, [ensureDraftAgent])

  const loadData = useCallback(async () => {
    const preserveLocalDraft = Boolean(agentId && skipNextSavedLoad.current)
    if (!preserveLocalDraft) setIsLoading(true)
    setLoadError(false)
    try {
      const options = await fetchKnowledgeSourceOptions(agentType)
      setSources(options)

      if (!agentId) {
        setItems([])
        setSelectedSlugs([])
        return
      }

      if (skipNextSavedLoad.current) {
        skipNextSavedLoad.current = false
        setSelectedSlugs(useAgentBuilderStore.getState().draftAgent.knowledge)
        return
      }

      const [rows, selections] = await Promise.all([
        fetchKnowledgeItems(agentId),
        fetchAgentKnowledgeSources(agentId),
      ])
      setItems(rows)
      setSelectedSlugs(selections.map((source) => source.slug))
    } catch {
      setLoadError(true)
    } finally {
      if (!preserveLocalDraft) setIsLoading(false)
    }
  }, [agentId, agentType])

  const persistItem = useCallback(
    async (item: EditableKnowledgeItem) => {
      const payload = toPayload(item)
      if (!payload) return
      if (savingItemIdsRef.current.has(item.id)) return

      clearSaveTimer(item.id)
      setSaveError(false)
      markItemSaving(item.id, true)
      try {
        const shouldReplaceUrl = !agentIdRef.current
        const targetAgentId = await ensureSavedAgentId()
        const saved = item.isDraft
          ? await createKnowledgeItem(targetAgentId, payload)
          : await updateKnowledgeItem(targetAgentId, item.id, payload)
        if (!saved.id) return
        setItems((current) => {
          let didReplace = false
          const next = current.map((existing) => {
            if (existing.id !== item.id) return existing
            didReplace = true
            return saved
          })
          return didReplace ? next : [...next, saved].sort((a, b) => a.position - b.position)
        })
        if (shouldReplaceUrl) {
          router.replace(`/agents/${targetAgentId}/knowledge`, { scroll: false })
        }
      } catch {
        setSaveError(true)
      } finally {
        markItemSaving(item.id, false)
      }
    },
    [clearSaveTimer, ensureSavedAgentId, markItemSaving, router]
  )

  const scheduleQaSave = useCallback(
    (item: EditableKnowledgeItem) => {
      clearSaveTimer(item.id)
      saveTimers.current.set(
        item.id,
        setTimeout(() => {
          void persistItem(item)
        }, 600)
      )
    },
    [clearSaveTimer, persistItem]
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    agentIdRef.current = agentId
  }, [agentId])

  useEffect(() => {
    const timers = saveTimers.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }, [])

  useEffect(() => {
    const focusId = pendingFocusId.current
    if (!focusId) return
    questionRefs.current.get(focusId)?.focus()
    pendingFocusId.current = null
  }, [items])

  const handleToggleSource = useCallback(
    async (source: KnowledgeSourceOption) => {
      if (!agentId) {
        toggleKnowledge(source.slug)
        return
      }

      const previous = selectedSlugs
      const next = previous.includes(source.slug)
        ? previous.filter((slug) => slug !== source.slug)
        : [...previous, source.slug]

      setSelectedSlugs(next)
      setSaveError(false)
      try {
        const saved = await updateAgentKnowledgeSources(agentId, next)
        setSelectedSlugs(saved.map((selected) => selected.slug))
      } catch {
        setSaveError(true)
        setSelectedSlugs(previous)
      }
    },
    [agentId, selectedSlugs, toggleKnowledge]
  )

  const handleAddQa = useCallback(
    (source: KnowledgeSourceOption) => {
      const item: EditableKnowledgeItem = {
        id: createDraftId(),
        type: 'qa',
        title: source.name,
        question: '',
        answer: '',
        content: null,
        sourceUrl: null,
        knowledgeSourceOptionId: source.id,
        position: nextPosition(items),
        isDraft: true,
      }
      pendingFocusId.current = item.id
      setItems((current) => [...current, item])
    },
    [items]
  )

  const handleAddDocument = useCallback(
    (source: KnowledgeSourceOption) => {
      const item: EditableKnowledgeItem = {
        id: createDraftId(),
        type: 'document',
        title: source.name,
        question: null,
        answer: null,
        content: '',
        sourceUrl: null,
        knowledgeSourceOptionId: source.id,
        position: nextPosition(items),
        isDraft: true,
      }
      setItems((current) => [...current, item])
    },
    [items]
  )

  const handleQaChange = useCallback(
    (item: EditableKnowledgeItem, patch: Partial<EditableKnowledgeItem>) => {
      const next = { ...item, ...patch }
      setItems((current) => current.map((existing) => (existing.id === item.id ? next : existing)))
      scheduleQaSave(next)
    },
    [scheduleQaSave]
  )

  const handleDocumentChange = useCallback(
    (item: EditableKnowledgeItem, patch: Partial<EditableKnowledgeItem>) => {
      const next = { ...item, ...patch }
      setItems((current) => current.map((existing) => (existing.id === item.id ? next : existing)))
    },
    []
  )

  const handleDocumentBlur = useCallback(
    (item: EditableKnowledgeItem) => {
      const latest = items.find((existing) => existing.id === item.id) ?? item
      void persistItem(latest)
    },
    [items, persistItem]
  )

  const handleDelete = useCallback(
    async (item: EditableKnowledgeItem) => {
      clearSaveTimer(item.id)
      setItems((current) => current.filter((existing) => existing.id !== item.id))
      if (item.isDraft || !agentId) return
      try {
        await deleteKnowledgeItem(agentId, item.id)
      } catch {
        setSaveError(true)
        setItems((current) => [...current, item].sort((a, b) => a.position - b.position))
      }
    },
    [agentId, clearSaveTimer]
  )

  const itemsForSource = useCallback(
    (source: KnowledgeSourceOption, type: KnowledgeItem['type']) =>
      items.filter((item) => item.type === type && item.knowledgeSourceOptionId === source.id),
    [items]
  )

  const renderHeader = () => (
    <div>
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
    </div>
  )

  const renderSourceCatalog = () => (
    <section className="max-w-4xl space-y-3">
      <div>
        <h3 className="text-sm font-medium">{t('sourcesTitle')}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('sourcesDescription')}</p>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {sources.map((source) => {
          const checked = effectiveSelectedSlugs.includes(source.slug)
          return (
            <div
              key={source.id}
              className="flex min-h-[72px] items-center gap-3 rounded-lg border bg-card p-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-lg">
                {source.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{source.name}</p>
                <p className="text-xs text-muted-foreground">{source.description}</p>
              </div>
              <Switch
                id={`knowledge-source-${source.slug}`}
                checked={checked}
                onCheckedChange={() => void handleToggleSource(source)}
                disabled={isCreatingDraft}
                aria-label={source.name}
              />
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {t('selectedCount', { count: effectiveSelectedSlugs.length })}
      </p>
    </section>
  )

  const renderQaPanel = (source: KnowledgeSourceOption) => {
    const qaItems = itemsForSource(source, 'qa')
    return (
      <section key={source.id} className="max-w-4xl space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="size-4 text-muted-foreground" />
              {source.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('qaDescription')}</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddQa(source)}
            disabled={isCreatingDraft}
          >
            <Plus className="size-4" />
            {t('addQa')}
          </Button>
        </div>

        {qaItems.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            {t('qaEmpty')}
          </div>
        ) : (
          <div className="space-y-2">
            {qaItems.map((item) => {
              const itemBusy = isCreatingDraft || savingItemIds.has(item.id)
              return (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <div className="grid min-w-0 flex-1 gap-2">
                      <label className="sr-only" htmlFor={`question-${item.id}`}>
                        {t('questionLabel')}
                      </label>
                      <Input
                        id={`question-${item.id}`}
                        ref={(node) => {
                          if (node) questionRefs.current.set(item.id, node)
                          else questionRefs.current.delete(item.id)
                        }}
                        value={item.question ?? ''}
                        onChange={(event) =>
                          handleQaChange(item, { question: event.currentTarget.value })
                        }
                        placeholder={t('questionPlaceholder')}
                        disabled={itemBusy}
                      />
                      <label className="sr-only" htmlFor={`answer-${item.id}`}>
                        {t('answerLabel')}
                      </label>
                      <Textarea
                        id={`answer-${item.id}`}
                        value={item.answer ?? ''}
                        onChange={(event) =>
                          handleQaChange(item, { answer: event.currentTarget.value })
                        }
                        placeholder={t('answerPlaceholder')}
                        className="min-h-20"
                        disabled={itemBusy}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(item)}
                      aria-label={t('deleteQa')}
                      disabled={itemBusy}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    )
  }

  const renderDocumentPanel = (source: KnowledgeSourceOption) => {
    const documentItems = itemsForSource(source, 'document')
    return (
      <section key={source.id} className="max-w-4xl space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <FileText className="size-4 text-muted-foreground" />
              {source.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('documentsDescription')}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddDocument(source)}
            disabled={isCreatingDraft}
          >
            <Plus className="size-4" />
            {t('addDocument')}
          </Button>
        </div>

        {documentItems.length === 0 ? (
          <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            {t('documentsEmpty')}
          </div>
        ) : (
          <div className="space-y-2">
            {documentItems.map((item) => {
              const itemBusy = isCreatingDraft || savingItemIds.has(item.id)
              return (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <div className="grid min-w-0 flex-1 gap-2">
                      <label className="sr-only" htmlFor={`document-title-${item.id}`}>
                        {t('documentTitleLabel')}
                      </label>
                      <Input
                        id={`document-title-${item.id}`}
                        value={item.title ?? ''}
                        onChange={(event) =>
                          handleDocumentChange(item, { title: event.currentTarget.value })
                        }
                        onBlur={() => handleDocumentBlur(item)}
                        placeholder={t('documentTitlePlaceholder')}
                        disabled={itemBusy}
                      />
                      <label className="sr-only" htmlFor={`document-content-${item.id}`}>
                        {t('documentContentLabel')}
                      </label>
                      <Textarea
                        id={`document-content-${item.id}`}
                        value={item.content ?? ''}
                        onChange={(event) =>
                          handleDocumentChange(item, { content: event.currentTarget.value })
                        }
                        onBlur={() => handleDocumentBlur(item)}
                        placeholder={t('documentContentPlaceholder')}
                        className="min-h-28"
                        disabled={itemBusy}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(item)}
                      aria-label={t('deleteDocument')}
                      disabled={itemBusy}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    )
  }

  const renderIntegrationPanel = (source: KnowledgeSourceOption) => (
    <section key={source.id} className="max-w-4xl rounded-lg border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700">
            <ShoppingBag className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-medium">{source.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{source.description}</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button type="button" disabled variant="outline" className="w-full sm:w-auto">
                {t('connectShopify')}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('comingSoon')}</TooltipContent>
        </Tooltip>
      </div>
    </section>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {renderHeader()}
        <div className="max-w-4xl grid gap-2 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[72px] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        {renderHeader()}
        <div className="max-w-2xl rounded-lg border p-4">
          <p className="text-sm text-destructive">{t('loadError')}</p>
          <Button
            type="button"
            variant="link"
            className="mt-2 h-auto p-0"
            onClick={() => void loadData()}
          >
            <RefreshCw className="size-3.5" />
            {t('retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-6">
        {renderHeader()}
        {renderSourceCatalog()}
        {saveError && <p className="max-w-4xl text-sm text-destructive">{t('saveError')}</p>}

        {selectedSources.length === 0 ? (
          <div className="max-w-4xl rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            {t('sourceEmpty')}
          </div>
        ) : (
          selectedSources.map((source) => {
            const mode = setupModeFor(source)
            if (mode === 'qa') return renderQaPanel(source)
            if (mode === 'integration') return renderIntegrationPanel(source)
            return renderDocumentPanel(source)
          })
        )}
      </div>
    </TooltipProvider>
  )
}

'use client'

import React, { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Skeleton } from '@forge/ui/src/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { siteConfig } from '@/config'
import { useAgentListStore } from '../store/agent-list.store'
import { MetricsGrid } from './MetricsGrid'
import { AgentTable } from './AgentTable'
import { UnresolvedIntents } from './UnresolvedIntents'

/** Split a name into [prefix, accent] for two-tone rendering */
function splitName(name: string, accent?: string): [string, string] {
  if (!accent) return [name.toLowerCase(), '']
  const lower = name.toLowerCase()
  const idx = lower.lastIndexOf(accent.toLowerCase())
  return idx === -1 ? [lower, ''] : [lower.slice(0, idx), lower.slice(idx)]
}

export const AgentDashboard = React.memo(function AgentDashboard() {
  const t = useTranslations('agentHub.dashboard')
  const {
    agents,
    metrics,
    unresolvedIntents,
    recommendation,
    isLoading,
    error,
    page,
    pageSize,
    total,
    search,
    statusFilter,
    loadAll,
    removeAgent,
    setPage,
    setSearch,
    setStatusFilter,
  } = useAgentListStore()

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const tSidebar = useTranslations('sidebar')
  const [prefix, accent] = splitName(siteConfig.name, siteConfig.nameAccent)
  const ws = siteConfig.workspaceName

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [setSearch]
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value === 'all' ? null : (value as 'live' | 'draft' | 'paused'))
    },
    [setStatusFilter]
  )

  const handleRetry = useCallback(() => {
    void loadAll()
  }, [loadAll])

  return (
    <div className="flex flex-col gap-4 overflow-y-auto lg:h-full lg:overflow-hidden">
      {/* ── Fixed header zone ── */}

      {/* Brand + action */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
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
        <Button asChild size="sm" className="shrink-0">
          <Link href="/agents/new">
            <Plus className="mr-1.5 size-3.5" />
            {t('newAgent')}
          </Link>
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/5 px-4 py-3 shrink-0">
          <AlertCircle className="size-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive flex-1">{t('error')}</p>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="mr-1.5 size-3.5" />
            {t('retry')}
          </Button>
        </div>
      )}

      {/* Metrics row — fixed height */}
      <div className="shrink-0">
        {isLoading || !metrics ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <MetricsGrid metrics={metrics} />
        )}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center shrink-0">
        <Input
          type="text"
          placeholder={t('searchAgents')}
          value={search}
          onChange={handleSearchChange}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter ?? 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="live">{t('statusLive')}</SelectItem>
            <SelectItem value="draft">{t('statusDraft')}</SelectItem>
            <SelectItem value="paused">{t('statusPaused')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Scrollable main zone — fills remaining viewport ── */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 lg:items-start lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Table column — scrolls independently on desktop */}
        <div className="lg:col-span-2 lg:min-h-0 lg:h-full lg:overflow-hidden flex flex-col">
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <AgentTable
              agents={agents}
              onDelete={removeAgent}
              title={t('yourAgents')}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Intents column — scrolls independently */}
        <div className="lg:min-h-0 lg:h-full lg:overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <UnresolvedIntents intents={unresolvedIntents} recommendation={recommendation} />
          )}
        </div>
      </div>
    </div>
  )
})

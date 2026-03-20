'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Skeleton } from '@forge/ui/src/skeleton'
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
  const { agents, metrics, unresolvedIntents, recommendation, isLoading, loadAll, removeAgent } =
    useAgentListStore()

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const tSidebar = useTranslations('sidebar')
  const [prefix, accent] = splitName(siteConfig.name, siteConfig.nameAccent)
  const ws = siteConfig.workspaceName

  return (
    <div className="space-y-6">
      {/* Secondary header — brand + workspace + action */}
      <div className="flex flex-wrap items-center justify-between gap-2">
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

      {isLoading || !metrics ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <MetricsGrid metrics={metrics} />
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <AgentTable agents={agents} onDelete={removeAgent} title={t('yourAgents')} />
          )}
        </div>

        <div className="space-y-1">
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

'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Card, CardContent, CardHeader, CardTitle } from '@forge/ui/src/card'
import { Skeleton } from '@forge/ui/src/skeleton'
import { useAgentListStore } from '../store/agent-list.store'
import { MetricsGrid } from './MetricsGrid'
import { AgentTable } from './AgentTable'
import { UnresolvedIntents } from './UnresolvedIntents'

export const AgentDashboard = React.memo(function AgentDashboard() {
  const t = useTranslations('agentHub.dashboard')
  const { agents, metrics, unresolvedIntents, recommendation, isLoading, loadAll, removeAgent } =
    useAgentListStore()

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <Button asChild>
          <Link href="/agents/new">
            <Plus className="mr-2 size-4" />
            {t('newAgent')}
          </Link>
        </Button>
      </div>

      {isLoading || !metrics ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <MetricsGrid metrics={metrics} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('yourAgents')}</h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <AgentTable agents={agents} onDelete={removeAgent} />
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('insights')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            ) : (
              <UnresolvedIntents intents={unresolvedIntents} recommendation={recommendation} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

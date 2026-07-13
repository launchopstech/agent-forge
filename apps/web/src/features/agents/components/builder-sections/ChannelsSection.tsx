'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Radio, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@forge/ui/src/badge'
import { Skeleton } from '@forge/ui/src/skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@forge/ui/src/empty'
import { useAgentBuilderStore } from '../../store/agent-builder.store'
import { fetchChannels, fetchRoutingRules } from '@/features/channels/api/channels.api'
import type {
  WorkspaceChannel,
  RoutingRule,
  KeywordConditionValue,
} from '@/features/channels/types'

interface ChannelWithRules extends WorkspaceChannel {
  agentRules: RoutingRule[]
}

function displayKeywords(cv: unknown): string {
  const value = cv as KeywordConditionValue | undefined
  if (!value?.keywords?.length) return ''
  return value.keywords.join(', ')
}

export function ChannelsSection() {
  const t = useTranslations('agentHub.builder.channels')
  const { agentId } = useAgentBuilderStore()
  const [channels, setChannels] = useState<ChannelWithRules[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!agentId) return
    setIsLoading(true)
    try {
      const allChannels = await fetchChannels()

      const enriched = await Promise.all(
        allChannels.map(async (ch) => {
          try {
            const rules = await fetchRoutingRules(ch.id)
            return { ...ch, agentRules: rules.filter((r) => r.agentId === agentId) }
          } catch {
            return { ...ch, agentRules: [] }
          }
        })
      )
      setChannels(enriched)
    } catch {
      // silent fail — channels are optional
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    void load()
  }, [load])

  const connected = channels.filter((c) => c.agentRules.length > 0)
  const available = channels.filter((c) => c.agentRules.length === 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Link
          href="/dashboard/channels"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Settings className="h-3.5 w-3.5" />
          Manage Channels
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2 max-w-lg">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      ) : channels.length === 0 ? (
        <Empty className="max-w-lg">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Radio className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
            <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href="/dashboard/channels"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Radio className="h-3.5 w-3.5" />
              {t('goToChannels')}
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="space-y-4 max-w-lg">
          {connected.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Connected ({connected.length})
              </p>
              {connected.map((ch) => (
                <ChannelRow key={ch.id} channel={ch} agentRules={ch.agentRules} connected />
              ))}
            </div>
          )}

          {available.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Available — add a routing rule to connect
              </p>
              {available.map((ch) => (
                <ChannelRow key={ch.id} channel={ch} agentRules={[]} connected={false} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChannelRow({
  channel,
  agentRules,
  connected,
}: {
  channel: WorkspaceChannel
  agentRules: RoutingRule[]
  connected: boolean
}) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Radio className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{channel.name}</p>
            <p className="text-xs capitalize text-muted-foreground">{channel.channelType}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="default" className="text-xs">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Not connected
            </Badge>
          )}
          <Link
            href={`/dashboard/channels/${channel.channelType}/setup?id=${channel.id}`}
            className="inline-flex items-center gap-1 rounded-md p-1 text-muted-foreground hover:text-foreground"
            title="Edit routing rules"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Display routing rules for this agent */}
      {agentRules.length > 0 && (
        <div className="ml-7 space-y-1">
          {agentRules.map((rule) => (
            <div key={rule.id} className="text-xs text-muted-foreground flex flex-col gap-0.5">
              <span>
                {rule.conditionType === 'always'
                  ? 'Condition: Always'
                  : `Keywords: ${displayKeywords(rule.conditionValue)}`}
              </span>
              {rule.agentInstructions && (
                <span className="italic">Instructions: {rule.agentInstructions}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

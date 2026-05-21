'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, Code2, Settings, Zap } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@forge/ui/src/skeleton'
import { fetchChannel } from '../api/channels.api'
import { fetchAgents } from '@/features/agents/api/agents.api'
import type { WorkspaceChannel } from '../types'
import type { Agent } from '@/features/agents/types'
import { RoutingRulesEditor } from './RoutingRulesEditor'
import { TestConsole } from './TestConsole'
import { EmbedSection } from './EmbedSection'

type SetupTab = 'routing' | 'test' | 'embed'

interface ChannelSetupPageProps {
  channelId: string
}

function defaultTabForChannel(channel: WorkspaceChannel): SetupTab {
  return channel.channelType === 'website' ? 'embed' : 'routing'
}

export function ChannelSetupPage({ channelId }: ChannelSetupPageProps) {
  const [channel, setChannel] = useState<WorkspaceChannel | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<SetupTab>('routing')

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const [ch, agentResult] = await Promise.all([
        fetchChannel(channelId),
        fetchAgents({ page: 1, pageSize: 100 }),
      ])
      setActiveTab(defaultTabForChannel(ch))
      setChannel(ch)
      setAgents(agentResult.data)
    } catch {
      // handled by empty state
    } finally {
      setIsLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    void load()
  }, [load])

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Channel not found.{' '}
        <Link href="/dashboard/channels" className="underline">
          Back to Channels
        </Link>
      </div>
    )
  }

  const isWebsiteChannel = channel.channelType === 'website'
  const tabs = [
    { id: 'routing' as const, label: 'Routing Rules', icon: Settings },
    ...(channel.channelType === 'test'
      ? [{ id: 'test' as const, label: 'Test Console', icon: Zap }]
      : []),
    ...(isWebsiteChannel ? [{ id: 'embed' as const, label: 'Embed', icon: Code2 }] : []),
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/channels"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Back to Channels"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">{channel.name}</h1>
          <p className="text-sm capitalize text-muted-foreground">{channel.channelType} channel</p>
        </div>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${
            channel.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {channel.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'routing' && (
        <RoutingRulesEditor
          channelId={channel.id}
          agents={agents.map((a) => ({ id: a.id, name: a.name }))}
        />
      )}

      {activeTab === 'test' && channel.channelType === 'test' && (
        <div className="max-w-xl">
          <TestConsole channelId={channel.id} channelName={channel.name} />
        </div>
      )}

      {activeTab === 'embed' && isWebsiteChannel && (
        <EmbedSection channel={channel} agents={agents} onConfigSaved={load} />
      )}
    </div>
  )
}

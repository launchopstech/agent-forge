'use client'

import { Bot, MessageCircle, Radio } from 'lucide-react'
import type { ElementType } from 'react'
import { useTranslations } from 'next-intl'
import type { DashboardMetrics } from '../types'

interface MetricsGridProps {
  metrics: DashboardMetrics
}

interface MetricCardProps {
  label: string
  value: number | null
  Icon: ElementType
}

function formatMetric(value: number | null): string {
  return value === null ? '—' : value.toLocaleString()
}

function MetricCard({ label, value, Icon }: MetricCardProps) {
  return (
    <div className="flex h-32 flex-col justify-between rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium leading-snug text-muted-foreground">{label}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="text-3xl font-bold leading-none tracking-tight">{formatMetric(value)}</div>
    </div>
  )
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const t = useTranslations('agentHub.dashboard')

  const cards = [
    {
      key: 'totalAgents',
      label: t('totalAgents'),
      value: metrics.totalAgents,
      Icon: Bot,
    },
    {
      key: 'activeAgents',
      label: t('activeAgents'),
      value: metrics.activeAgents,
      Icon: Radio,
    },
    {
      key: 'totalMessages',
      label: t('totalMessages'),
      value: metrics.totalMessages,
      Icon: MessageCircle,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map(({ key, label, value, Icon }) => (
        <MetricCard key={key} label={label} value={value} Icon={Icon} />
      ))}
    </div>
  )
}

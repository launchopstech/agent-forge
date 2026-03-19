'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { MessageCircle, CheckCircle, ArrowRightLeft, Clock } from 'lucide-react'
import { cn } from '@forge/ui/src/utils'
import type { DashboardMetrics } from '../types'

interface MetricsGridProps {
  metrics: DashboardMetrics
}

// 7-point sparkline data — last bar is the "current" highlight
const SPARKLINE = [40, 55, 35, 70, 60, 80, 95]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MAX_VAL = Math.max(...SPARKLINE)

// ─── Bar chart with day labels (back of card) ────────────────────────────────
function BarChart({ positive }: { positive: boolean | null }) {
  const barColor = positive === false ? 'bg-destructive' : 'bg-primary'
  const barFaint = positive === false ? 'bg-destructive/20' : 'bg-primary/20'
  return (
    <div className="flex items-end justify-between gap-1 w-full h-full" aria-hidden="true">
      {SPARKLINE.map((v, i) => {
        const isLast = i === SPARKLINE.length - 1
        return (
          <div key={i} className="flex flex-col items-center gap-[3px] flex-1 h-full justify-end">
            <div
              className={cn('w-full rounded-[2px]', isLast ? barColor : barFaint)}
              style={{ height: `${(v / MAX_VAL) * 100}%` }}
            />
            <span
              className={cn(
                'text-[9px] leading-none shrink-0',
                isLast ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              {DAYS[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Trend chip ─────────────────────────────────────────────────────────────
function TrendChip({ change, positive }: { change: string; positive: boolean | null }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-1 py-0.5 rounded-full leading-none',
        positive === null
          ? 'bg-muted text-muted-foreground'
          : positive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-destructive/10 text-destructive'
      )}
    >
      {change}
    </span>
  )
}

// ─── Single flip card ────────────────────────────────────────────────────────
interface FlipCardProps {
  label: string
  value: string
  change: string
  positive: boolean | null
  colorValue: boolean
  Icon: React.ElementType
  fromLastMonth: string
  chartLabel: string
}

function FlipCard({
  label,
  value,
  change,
  positive,
  colorValue,
  Icon,
  fromLastMonth,
  chartLabel,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const toggle = useCallback(() => setFlipped((f) => !f), [])

  return (
    // perspective wrapper — inline style required; Tailwind arbitrary 3D props are unreliable cross-browser
    <div
      style={{ perspective: '900px' }}
      className="cursor-pointer select-none"
      onClick={toggle}
      role="button"
      aria-label={`${label} — click to ${flipped ? 'show metric' : 'show chart'}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggle()}
    >
      {/* flipper */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 500ms ease-in-out',
        }}
        className="relative h-[142px]"
      >
        {/* ── FRONT ── */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-xl border bg-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground leading-snug">{label}</span>
            <span className="shrink-0 rounded-md bg-primary/10 p-1.5 text-primary">
              <Icon className="size-3.5" />
            </span>
          </div>
          <div
            className={cn(
              'text-2xl font-bold tracking-tight leading-none',
              !colorValue || positive === null
                ? 'text-foreground'
                : positive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400'
            )}
          >
            {value}
          </div>
          <div className="flex items-center gap-1.5">
            <TrendChip change={change} positive={positive} />
            <span className="text-[10px] text-muted-foreground">{fromLastMonth}</span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-xl border bg-card p-4 flex flex-col gap-1.5"
        >
          <span className="text-[10px] font-medium text-muted-foreground shrink-0">
            {chartLabel}
          </span>
          <div className="flex-1 min-h-0">
            <BarChart positive={positive} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Grid ────────────────────────────────────────────────────────────────────
export function MetricsGrid({ metrics }: MetricsGridProps) {
  const t = useTranslations('agentHub.dashboard')

  const cards = [
    {
      key: 'totalConversations',
      label: t('totalConversations'),
      value: metrics.totalConversations.toLocaleString(),
      change:
        metrics.totalConversationsChange > 0
          ? `+${metrics.totalConversationsChange}%`
          : `${metrics.totalConversationsChange}%`,
      positive: metrics.totalConversationsChange >= 0,
      colorValue: false,
      Icon: MessageCircle,
    },
    {
      key: 'resolutionRate',
      label: t('resolutionRate'),
      value: `${metrics.resolutionRate}%`,
      change:
        metrics.resolutionRateChange > 0
          ? `+${metrics.resolutionRateChange}%`
          : `${metrics.resolutionRateChange}%`,
      positive: metrics.resolutionRateChange >= 0,
      colorValue: true,
      Icon: CheckCircle,
    },
    {
      key: 'handoffRate',
      label: t('handoffRate'),
      value: `${metrics.handoffRate}%`,
      change:
        metrics.handoffRateChange > 0
          ? `+${metrics.handoffRateChange}%`
          : `${metrics.handoffRateChange}%`,
      positive: metrics.handoffRateChange <= 0,
      colorValue: true,
      Icon: ArrowRightLeft,
    },
    {
      key: 'avgResponseTime',
      label: t('avgResponseTime'),
      value: metrics.avgResponseTime,
      change:
        metrics.avgResponseTimeChange === 0 ? t('noChange') : `${metrics.avgResponseTimeChange}%`,
      positive: metrics.avgResponseTimeChange === 0 ? null : metrics.avgResponseTimeChange <= 0,
      colorValue: false,
      Icon: Clock,
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, value, change, positive, colorValue, Icon }) => (
        <FlipCard
          key={key}
          label={label}
          value={value}
          change={change}
          positive={positive}
          colorValue={colorValue}
          Icon={Icon}
          fromLastMonth={t('fromLastMonth')}
          chartLabel={t('last7Days')}
        />
      ))}
    </div>
  )
}

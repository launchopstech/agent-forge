'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { cn } from '@forge/ui/src/utils'
import type { UnresolvedIntent, Recommendation } from '../types'

interface UnresolvedIntentsProps {
  intents: UnresolvedIntent[]
  recommendation: Recommendation | null
}

function severityColor(severity: UnresolvedIntent['severity']) {
  switch (severity) {
    case 'high':
      return 'bg-destructive'
    case 'medium':
      return 'bg-amber-500 dark:bg-amber-400'
    case 'low':
      return 'bg-primary'
  }
}

export function UnresolvedIntents({ intents, recommendation }: UnresolvedIntentsProps) {
  const t = useTranslations('agentHub.dashboard')

  return (
    <div className="space-y-3">
      {/* ── Intents card ── */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <p className="text-base font-bold">{t('unresolvedIntents')}</p>

        <table className="w-full border-separate border-spacing-y-2">
          <tbody>
            {intents.map((intent) => (
              <tr key={intent.label}>
                <td className="text-sm whitespace-nowrap pr-3 align-middle">{intent.label}</td>
                <td className="w-full align-middle">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-2 rounded-full', severityColor(intent.severity))}
                      style={{ width: `${intent.percentage}%` }}
                    />
                  </div>
                </td>
                <td className="text-sm whitespace-nowrap pl-3 text-right align-middle">
                  {intent.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/agents/new">{t('fixInBuilder')}</Link>
        </Button>
      </div>

      {/* ── Recommendation alert card ── */}
      {recommendation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                {t('handoffRateRising')}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">{recommendation.message}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-300 bg-white dark:bg-transparent hover:bg-amber-50"
            asChild
          >
            <Link href={`/agents/${recommendation.agentId}/behaviour`}>{t('openBuilder')}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

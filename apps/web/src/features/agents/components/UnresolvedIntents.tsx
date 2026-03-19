'use client'

import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@forge/ui/src/alert'
import { AlertTriangle } from 'lucide-react'
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
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">{t('unresolvedIntents')}</h3>

      <div className="space-y-3">
        {intents.map((intent) => (
          <div key={intent.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{intent.label}</span>
              <span className="font-medium">{intent.percentage}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
              <div
                className={cn('h-1.5 rounded-full', severityColor(intent.severity))}
                style={{ width: `${intent.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {recommendation && (
        <Alert
          variant="default"
          className="border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30"
        >
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {recommendation.message}{' '}
            <span className="font-medium underline cursor-pointer">{recommendation.cta}</span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

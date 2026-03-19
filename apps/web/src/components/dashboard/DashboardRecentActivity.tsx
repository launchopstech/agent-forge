import { getTranslations } from 'next-intl/server'

import { Avatar, AvatarFallback } from '@forge/ui/src/avatar'
import { Badge } from '@forge/ui/src/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@forge/ui/src/card'

const recentRuns = [
  {
    id: '1',
    agent: 'Data Sync Agent',
    workflow: 'CRM → Analytics',
    initials: 'DS',
    status: 'success',
    duration: '1m 23s',
  },
  {
    id: '2',
    agent: 'Email Responder',
    workflow: 'Support Inbox',
    initials: 'ER',
    status: 'success',
    duration: '0m 45s',
  },
  {
    id: '3',
    agent: 'Report Builder',
    workflow: 'Monthly KPIs',
    initials: 'RB',
    status: 'running',
    duration: '3m 12s',
  },
  {
    id: '4',
    agent: 'Lead Qualifier',
    workflow: 'Inbound CRM',
    initials: 'LQ',
    status: 'success',
    duration: '0m 58s',
  },
  {
    id: '5',
    agent: 'Invoice Parser',
    workflow: 'Finance Ops',
    initials: 'IP',
    status: 'failed',
    duration: '0m 34s',
  },
] as const

const statusVariant = {
  success: 'default',
  running: 'secondary',
  failed: 'destructive',
} as const

export async function DashboardRecentActivity() {
  const t = await getTranslations('dashboard')

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t('recentActivity')}</CardTitle>
        <CardDescription>{t('recentActivityDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentRuns.map((run) => (
            <div key={run.id} className="flex items-center gap-4">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {run.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">{run.agent}</p>
                <p className="text-sm text-muted-foreground truncate">{run.workflow}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={statusVariant[run.status]}>{run.status}</Badge>
                <span className="text-xs text-muted-foreground">{run.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

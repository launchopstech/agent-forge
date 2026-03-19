import { getTranslations } from 'next-intl/server'
import { Activity, Bot, GitBranch, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@forge/ui/src/card'
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity'
import { DashboardOverview } from '@/components/dashboard/DashboardOverviewLazy'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')

  const stats = [
    {
      key: 'totalRuns',
      label: t('totalRuns'),
      value: '45,231',
      change: t('totalRunsChange'),
      Icon: Activity,
    },
    {
      key: 'activeAgents',
      label: t('activeAgents'),
      value: '12',
      change: t('activeAgentsChange'),
      Icon: Bot,
    },
    {
      key: 'activeWorkflows',
      label: t('activeWorkflows'),
      value: '8',
      change: t('activeWorkflowsChange'),
      Icon: GitBranch,
    },
    {
      key: 'successRate',
      label: t('successRate'),
      value: '98.2%',
      change: t('successRateChange'),
      Icon: TrendingUp,
    },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('overview')}</h1>
      </div>

      {/* KPI stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, label, value, change, Icon }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overview chart + Recent activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <DashboardOverview />
        <DashboardRecentActivity />
      </div>
    </div>
  )
}

import { getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')

  const stats = [
    { labelKey: 'activeAgents', value: '0' },
    { labelKey: 'workflows', value: '0' },
    { labelKey: 'runsToday', value: '0' },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('overview')}</h1>
        <p className="text-muted-foreground">{t('welcome')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@forge/ui/src/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@forge/ui/src/chart'
import type { ChartConfig } from '@forge/ui/src/chart'

const data = [
  { month: 'Jan', runs: 1840 },
  { month: 'Feb', runs: 2350 },
  { month: 'Mar', runs: 3120 },
  { month: 'Apr', runs: 2780 },
  { month: 'May', runs: 3890 },
  { month: 'Jun', runs: 4230 },
  { month: 'Jul', runs: 3780 },
  { month: 'Aug', runs: 4510 },
  { month: 'Sep', runs: 3920 },
  { month: 'Oct', runs: 4680 },
  { month: 'Nov', runs: 5120 },
  { month: 'Dec', runs: 4980 },
]

const chartConfig: ChartConfig = {
  runs: {
    label: 'Agent Runs',
    color: 'var(--primary)',
  },
}

export function DashboardOverview() {
  const t = useTranslations('dashboard')

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{t('monthlyOverview')}</CardTitle>
        <CardDescription>{t('monthlyOverviewDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="runs" fill="var(--color-runs)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@forge/ui/src/skeleton'

// Lazy-load recharts to keep it out of the initial bundle
const DashboardOverview = dynamic(
  () => import('./DashboardOverview').then((m) => m.DashboardOverview),
  {
    ssr: false,
    loading: () => <Skeleton className="col-span-4 h-[430px] w-full rounded-xl" />,
  }
)

export { DashboardOverview }

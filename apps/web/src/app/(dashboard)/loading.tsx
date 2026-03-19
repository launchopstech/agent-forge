import React from 'react'
import { Skeleton, SkeletonBlock } from '@forge/ui/src/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-40" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonBlock height="h-32" />
        <SkeletonBlock height="h-32" />
        <SkeletonBlock height="h-32" />
        <SkeletonBlock height="h-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SkeletonBlock height="h-[430px]" className="col-span-4" />
        <SkeletonBlock height="h-[430px]" className="col-span-3" />
      </div>
    </div>
  )
}

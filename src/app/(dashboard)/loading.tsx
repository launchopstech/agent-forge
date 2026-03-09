import { Skeleton, SkeletonBlock, SkeletonText } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock height="h-32" />
        <SkeletonBlock height="h-32" />
        <SkeletonBlock height="h-32" />
      </div>
      <SkeletonText lines={4} />
    </div>
  )
}

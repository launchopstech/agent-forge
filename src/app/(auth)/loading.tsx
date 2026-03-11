import { Skeleton, SkeletonBlock } from '@/components/ui/skeleton'

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-28" />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        {/* Title + subtitle */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <SkeletonBlock height="h-9" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <SkeletonBlock height="h-9" />
          </div>
          <SkeletonBlock height="h-9" />
        </div>
      </div>
    </div>
  )
}

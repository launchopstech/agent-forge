import React from 'react'
import { Skeleton } from '@forge/ui/src/skeleton'

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {/* Logo — full brand primary matches the real AuthLayout logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary animate-pulse" />
        <Skeleton className="h-6 w-28" />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        {/* Title + subtitle */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Form fields — inputs use border like real inputs, not solid gray blocks */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <div className="h-9 w-full rounded-md border border-primary/40 bg-primary/10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="h-9 w-full rounded-md border border-primary/40 bg-primary/10 animate-pulse" />
          </div>
          {/* Submit button — full brand primary matches the real primary Button */}
          <div className="h-9 w-full rounded-md bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  )
}

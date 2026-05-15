import React from 'react'
import { Skeleton } from '@forge/ui/src/skeleton'

export default function AuthLoading() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <div className="h-9 w-full animate-pulse rounded-md border border-primary/40 bg-primary/10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="h-9 w-full animate-pulse rounded-md border border-primary/40 bg-primary/10" />
        </div>
        <div className="h-9 w-full animate-pulse rounded-md bg-primary" />
      </div>
    </div>
  )
}

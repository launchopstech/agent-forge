import React from 'react'
import { SkeletonBlock } from '@forge/ui/src/skeleton'

export default function MarketingLoading() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:px-8 bg-background min-h-screen">
      <SkeletonBlock height="h-64" />
      <SkeletonBlock height="h-32" />
      <SkeletonBlock height="h-48" />
    </div>
  )
}

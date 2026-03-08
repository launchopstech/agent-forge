'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-muted-foreground/30">500</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}

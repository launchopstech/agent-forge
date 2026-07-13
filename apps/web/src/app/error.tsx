'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@forge/ui/src/button'

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')
  const c = useTranslations('common')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl font-bold text-muted-foreground/30">500</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">{t('serverError')}</h1>
      <p className="mt-2 text-muted-foreground">{t('serverErrorDescription')}</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset} variant="outline">
          {c('retry')}
        </Button>
        <Button asChild>
          <Link href="/">{c('goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}

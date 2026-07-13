import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@forge/ui/src/button'
import { siteConfig } from '@forge/config/src/site'

export default async function NotFound() {
  const t = await getTranslations('errors')
  const c = await getTranslations('common')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center border-b border-border bg-card px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold text-foreground">{siteConfig.name}</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-8xl font-bold text-muted-foreground/30">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">{t('notFound')}</h1>
        <p className="mt-2 text-muted-foreground">{t('notFoundDescription')}</p>
        <Button asChild className="mt-8">
          <Link href="/">{c('goHome')}</Link>
        </Button>
      </main>
    </div>
  )
}

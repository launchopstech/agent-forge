import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export default function NotFound() {
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
        <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Go home</Link>
        </Button>
      </main>
    </div>
  )
}

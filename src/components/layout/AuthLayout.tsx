import Link from 'next/link'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'

interface AuthLayoutProps {
  children: React.ReactNode
  showLogo?: boolean
  logoText?: string
  centered?: boolean
  className?: string
}

export function AuthLayout({
  children,
  showLogo = true,
  logoText,
  centered = true,
  className,
}: AuthLayoutProps) {
  const name = logoText ?? siteConfig.name

  return (
    <div
      className={cn(
        'min-h-screen bg-background flex flex-col',
        centered ? 'items-center justify-center' : 'items-center pt-20',
        className
      )}
    >
      {showLogo && (
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="text-xl font-bold text-foreground">{name}</span>
        </Link>
      )}
      {children}
    </div>
  )
}

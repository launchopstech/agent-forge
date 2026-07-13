import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { siteConfig, activeBrand } from '@/config'

function splitName(name: string, accent?: string): [string, string] {
  if (!accent) return [name.toLowerCase(), '']
  const lower = name.toLowerCase()
  const accentLower = accent.toLowerCase()
  const idx = lower.lastIndexOf(accentLower)
  if (idx === -1) return [lower, '']
  return [lower.slice(0, idx), lower.slice(idx)]
}
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

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
  const [prefix, accent] = splitName(name, logoText ? undefined : siteConfig.nameAccent)

  return (
    <div
      className={cn(
        'min-h-screen bg-background flex flex-col',
        centered ? 'items-center justify-center' : 'items-center pt-20',
        className
      )}
    >
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      {showLogo && (
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image
            src={activeBrand.assets.logoIconPath ?? activeBrand.assets.logoPath}
            alt={name}
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-foreground">{prefix}</span>
            {accent && <span className="text-primary">{accent}</span>}
          </span>
        </Link>
      )}
      {children}
    </div>
  )
}

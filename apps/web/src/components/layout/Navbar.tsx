'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@forge/ui/src/button'
import { Sheet, SheetContent, SheetTrigger } from '@forge/ui/src/sheet'
import { cn } from '@/lib/utils'
import { siteConfig, marketingNavItems } from '@/config'
import type { NavItem } from '@forge/config/src/types'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

interface NavbarProps {
  navItems?: NavItem[]
  logoText?: string
  logoHref?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  className?: string
}

export const Navbar = React.memo(function Navbar({
  navItems = marketingNavItems,
  logoText,
  logoHref = '/',
  ctaPrimary,
  ctaSecondary,
  className,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')
  const name = logoText ?? siteConfig.name
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <nav
      className={cn(
        'flex items-center justify-between border-b border-border bg-card px-6 py-4 sm:px-8',
        className
      )}
    >
      {/* Logo */}
      <Link href={logoHref} className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary" />
        <span className="text-xl font-bold text-foreground">{name}</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTAs */}
      <div className="hidden items-center gap-3 md:flex">
        <LocaleSwitcher />
        {ctaSecondary && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
          </Button>
        )}
        {ctaPrimary && (
          <Button size="sm" asChild>
            <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
          </Button>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="flex md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('openMenu')}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex flex-col gap-6 pt-6">
              <Link href={logoHref} className="flex items-center gap-2" onClick={handleClose}>
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold text-foreground">{name}</span>
              </Link>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2">
                {ctaSecondary && (
                  <Button variant="outline" asChild>
                    <Link href={ctaSecondary.href} onClick={handleClose}>
                      {ctaSecondary.label}
                    </Link>
                  </Button>
                )}
                {ctaPrimary && (
                  <Button asChild>
                    <Link href={ctaPrimary.href} onClick={handleClose}>
                      {ctaPrimary.label}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
})

import React from 'react'
import { cn } from '@/lib/utils'
import { marketingNavItems, footerNavColumns } from '@/config'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import type { NavItem } from '@forge/config/src/types'

interface MarketingLayoutProps {
  children: React.ReactNode
  navItems?: NavItem[]
  showFooter?: boolean
  footerColumns?: Array<{ heading: string; items: NavItem[] }>
  copyrightText?: string
  className?: string
}

export function MarketingLayout({
  children,
  navItems = marketingNavItems,
  showFooter = true,
  footerColumns = footerNavColumns,
  copyrightText,
  className,
}: MarketingLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background flex flex-col', className)}>
      <Navbar
        navItems={navItems}
        ctaSecondary={{ label: 'Log in', href: '/login' }}
        ctaPrimary={{ label: 'Get started free', href: '/signup' }}
      />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer columns={footerColumns} copyrightText={copyrightText} />}
    </div>
  )
}

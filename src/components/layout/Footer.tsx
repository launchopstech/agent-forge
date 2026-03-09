import React from 'react'
import { cn } from '@/lib/utils'
import { siteConfig, footerNavColumns } from '@/config'
import type { NavItem } from '@/types'

interface FooterProps {
  columns?: Array<{ heading: string; items: NavItem[] }>
  copyrightText?: string
  logoText?: string
  className?: string
}

export const Footer = React.memo(function Footer({
  columns = footerNavColumns,
  copyrightText,
  logoText,
  className,
}: FooterProps) {
  const year = new Date().getFullYear()
  const name = logoText ?? siteConfig.name
  const copyright = copyrightText ?? `© ${year} ${name}. All rights reserved.`

  return (
    <footer className={cn('border-t border-border bg-muted/30 px-6 py-12 sm:px-8', className)}>
      <div className="mx-auto max-w-5xl">
        <div
          className={cn('grid gap-8', columns.length > 0 && 'sm:grid-cols-[1fr_repeat(3,auto)]')}
        >
          <div>
            <p className="font-semibold text-foreground">{name}</p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-semibold text-foreground">{col.heading}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  )
})

'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@forge/ui/src/sidebar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { siteConfig, dashboardNavGroups, dashboardFooterNavItems, activeBrand } from '@/config'
import type { NavGroup, NavItem } from '@forge/config/src/types'

interface AppSidebarProps {
  navGroups?: NavGroup[]
  footerItems?: NavItem[]
  logoText?: string
  logoHref?: string
  className?: string
}

/** Split a name into [prefix, accent] parts for two-tone rendering */
function splitName(name: string, accent?: string): [string, string] {
  if (!accent) return [name.toLowerCase(), '']
  const lower = name.toLowerCase()
  const accentLower = accent.toLowerCase()
  const idx = lower.lastIndexOf(accentLower)
  if (idx === -1) return [lower, '']
  return [lower.slice(0, idx), lower.slice(idx)]
}

export const AppSidebar = React.memo(function AppSidebar({
  navGroups = dashboardNavGroups,
  footerItems = dashboardFooterNavItems,
  logoText,
  logoHref = '/',
  className,
}: AppSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations('sidebar')
  const { setOpen, state, isMobile } = useSidebar()

  const rawName = logoText ?? siteConfig.name
  const [prefix, accent] = splitName(rawName, logoText ? undefined : siteConfig.nameAccent)

  const onAgentsRoute = pathname.startsWith('/agents')

  // Tracks whether the current open state was triggered by hover (not by the SidebarTrigger).
  // Only hover-opened sessions should collapse on mouse-leave.
  // SidebarTrigger clicks never set this flag, so they stay permanently open/closed.
  const hoverOpened = useRef(false)

  // Track the previous route so we only collapse on TRANSITION into /agents,
  // not on every re-render while already there.
  // (shadcn's setOpen is re-created whenever `open` changes, so including it in
  // deps would re-run this effect after every hover/trigger open and fight them.)
  const prevOnAgentsRoute = useRef(false)

  useEffect(() => {
    const entering = onAgentsRoute && !prevOnAgentsRoute.current
    prevOnAgentsRoute.current = onAgentsRoute

    if (entering && !isMobile) {
      hoverOpened.current = false
      setOpen(false)
    }
  }, [onAgentsRoute, isMobile, setOpen])

  // Hover-to-peek: expand while mouse is inside, collapse when it leaves —
  // but only if WE opened it via hover (not the user via SidebarTrigger).
  const handleMouseEnter = useCallback(() => {
    if (state === 'collapsed' && !isMobile) {
      hoverOpened.current = true
      setOpen(true)
    }
  }, [state, setOpen, isMobile])

  const handleMouseLeave = useCallback(() => {
    if (hoverOpened.current && !isMobile) {
      hoverOpened.current = false
      setOpen(false)
    }
  }, [isMobile, setOpen])

  return (
    <Sidebar
      collapsible="icon"
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={logoHref}>
                {/* Icon mark — visible both expanded and icon-only */}
                <Image
                  src={activeBrand.assets.logoIconPath ?? activeBrand.assets.logoPath}
                  alt={rawName}
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0"
                />
                {/* Two-tone brand name — hidden when sidebar collapses to icon */}
                <span className="font-bold tracking-tight">
                  <span className="text-foreground">{prefix}</span>
                  {accent && <span className="text-primary">{accent}</span>}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, i) => (
          <SidebarGroup key={i}>
            {group.label && (
              <SidebarGroupLabel>
                {group.labelKey ? t(group.labelKey as Parameters<typeof t>[0]) : group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const label = item.labelKey
                  ? t(item.labelKey as Parameters<typeof t>[0])
                  : item.label
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                      tooltip={label}
                    >
                      <Link
                        href={item.href}
                        className={cn(pathname === item.href && 'font-medium')}
                      >
                        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                        <span>{label}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs font-medium text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {footerItems && footerItems.length > 0 && (
        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((item) => {
              const label = item.labelKey ? t(item.labelKey as Parameters<typeof t>[0]) : item.label
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={label}>
                    <Link href={item.href}>
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
})

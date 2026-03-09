'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { siteConfig, dashboardNavGroups, dashboardFooterNavItems } from '@/config'
import type { NavGroup, NavItem } from '@/types'

interface AppSidebarProps {
  navGroups?: NavGroup[]
  footerItems?: NavItem[]
  logoText?: string
  logoHref?: string
  className?: string
}

export const AppSidebar = React.memo(function AppSidebar({
  navGroups = dashboardNavGroups,
  footerItems = dashboardFooterNavItems,
  logoText,
  logoHref = '/',
  className,
}: AppSidebarProps) {
  const pathname = usePathname()
  const name = logoText ?? siteConfig.name

  return (
    <Sidebar collapsible="icon" className={cn(className)}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href={logoHref}>
                <div className="h-8 w-8 rounded-lg bg-primary shrink-0" />
                <span className="font-bold text-foreground">{name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, i) => (
          <SidebarGroup key={i}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href} className={cn(pathname === item.href && 'font-medium')}>
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {footerItems && footerItems.length > 0 && (
        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
})

import React from 'react'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@forge/ui/src/sidebar'
import { AppSidebar } from './AppSidebar'
import { Topbar } from './Topbar'
import type { NavGroup, NavItem } from '@forge/config/src/types'

interface DashboardLayoutProps {
  children: React.ReactNode
  navGroups?: NavGroup[]
  footerItems?: NavItem[]
  showSidebar?: boolean
  showTopbar?: boolean
  topbarRightSlot?: React.ReactNode
  className?: string
}

export function DashboardLayout({
  children,
  navGroups,
  footerItems,
  showSidebar = true,
  showTopbar = true,
  topbarRightSlot,
  className,
}: DashboardLayoutProps) {
  if (!showSidebar) {
    return (
      <div className={cn('min-h-screen bg-background flex flex-col', className)}>
        {showTopbar && <Topbar showSidebarTrigger={false} rightSlot={topbarRightSlot} />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    )
  }

  return (
    <SidebarProvider className={className}>
      <AppSidebar navGroups={navGroups} footerItems={footerItems} />
      <SidebarInset className="min-w-0">
        {showTopbar && <Topbar rightSlot={topbarRightSlot} />}
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Topbar } from './Topbar'
import type { NavGroup, NavItem } from '@/types'

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
    <SidebarProvider>
      <div className={cn('flex min-h-screen w-full', className)}>
        <AppSidebar navGroups={navGroups} footerItems={footerItems} />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {showTopbar && <Topbar rightSlot={topbarRightSlot} />}
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

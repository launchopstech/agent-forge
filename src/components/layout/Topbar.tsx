'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface TopbarProps {
  showSidebarTrigger?: boolean
  rightSlot?: React.ReactNode
  className?: string
}

function UserAvatarPlaceholder() {
  return (
    <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center">
      <span className="text-xs font-medium text-muted-foreground">U</span>
    </div>
  )
}

export function Topbar({ showSidebarTrigger = true, rightSlot, className }: TopbarProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b border-border bg-card px-4',
        className
      )}
    >
      <div className="flex items-center gap-2">{showSidebarTrigger && <SidebarTrigger />}</div>
      <div className="flex items-center gap-3">{rightSlot ?? <UserAvatarPlaceholder />}</div>
    </header>
  )
}

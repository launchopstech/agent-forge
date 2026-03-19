'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { SidebarTrigger } from '@forge/ui/src/sidebar'
import { Separator } from '@forge/ui/src/separator'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config'

interface TopbarProps {
  showSidebarTrigger?: boolean
  workspaceName?: string
  rightSlot?: React.ReactNode
  className?: string
}

/** Split a lowercase name into [prefix, accent] for two-tone rendering */
function splitName(name: string, accent?: string): [string, string] {
  if (!accent) return [name.toLowerCase(), '']
  const lower = name.toLowerCase()
  const idx = lower.lastIndexOf(accent.toLowerCase())
  return idx === -1 ? [lower, ''] : [lower.slice(0, idx), lower.slice(idx)]
}

const UserAvatarPlaceholder = React.memo(function UserAvatarPlaceholder() {
  return (
    <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center">
      <span className="text-xs font-medium text-muted-foreground">U</span>
    </div>
  )
})

export const Topbar = React.memo(function Topbar({
  showSidebarTrigger = true,
  workspaceName,
  rightSlot,
  className,
}: TopbarProps) {
  const t = useTranslations('sidebar')
  const [prefix, accent] = splitName(siteConfig.name, siteConfig.nameAccent)
  const ws = workspaceName ?? siteConfig.workspaceName

  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b border-border bg-card px-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showSidebarTrigger && <SidebarTrigger />}

        {/* Two-tone brand name */}
        <span className="font-bold tracking-tight text-sm select-none">
          <span className="text-foreground">{prefix}</span>
          {accent && <span className="text-primary">{accent}</span>}
        </span>

        {/* Workspace badge */}
        {ws && (
          <>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <span className="text-sm text-muted-foreground">
              {t('workspaceLabel')}: <span className="font-medium text-foreground">{ws}</span>
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">{rightSlot ?? <UserAvatarPlaceholder />}</div>
    </header>
  )
})

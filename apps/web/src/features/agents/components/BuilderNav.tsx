'use client'

import { useCallback, useEffect, useRef, useState, type ElementType } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Pause,
  Play,
  Radio,
  Rocket,
  SlidersHorizontal,
  User,
  Zap,
} from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Progress } from '@forge/ui/src/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@forge/ui/src/tooltip'
import { cn } from '@forge/ui/src/utils'
import { siteConfig } from '@/config'
import { toast } from '@/hooks/use-toast'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { BuilderSection } from '../types'

const SECTIONS: BuilderSection[] = ['identity', 'behaviour', 'actions', 'knowledge', 'channels']

const SECTION_ICONS: Record<BuilderSection, ElementType> = {
  identity: User,
  behaviour: SlidersHorizontal,
  actions: Zap,
  knowledge: BookOpen,
  channels: Radio,
}

interface BuilderNavProps {
  agentId: string
}

export function BuilderNav({ agentId }: BuilderNavProps) {
  const t = useTranslations('agentHub.builder')
  const router = useRouter()
  const {
    activeSection,
    completedSections,
    agentStatus,
    isSaving,
    publishAgent,
    pauseAgent,
    resumeAgent,
  } = useAgentBuilderStore()
  const [copied, setCopied] = useState(false)
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const progressPercent = Math.round((completedSections.length / SECTIONS.length) * 100)
  const canChangeStatus = agentId !== 'new' && agentStatus !== null
  const showShareLink = canChangeStatus && agentStatus === 'live'
  const shareUrl = showShareLink ? `${siteConfig.url.replace(/\/$/, '')}/chat/${agentId}` : null

  const statusLabel =
    agentStatus === 'draft'
      ? t('publish')
      : agentStatus === 'live'
        ? t('pause')
        : agentStatus === 'paused'
          ? t('resume')
          : null
  const StatusIcon: ElementType =
    agentStatus === 'live' ? Pause : agentStatus === 'paused' ? Play : Rocket
  const statusButtonVariant = agentStatus === 'draft' ? 'default' : 'outline'

  const handleClick = useCallback(
    (section: BuilderSection) => {
      router.push(`/agents/${agentId}/${section}`)
    },
    [router, agentId]
  )

  const handleStatusClick = useCallback(async () => {
    if (!agentStatus) return

    try {
      if (agentStatus === 'draft') {
        await publishAgent()
        toast({ title: t('publishSuccess') })
      } else if (agentStatus === 'live') {
        await pauseAgent()
        toast({ title: t('pauseSuccess') })
      } else {
        await resumeAgent()
        toast({ title: t('resumeSuccess') })
      }
    } catch (err) {
      toast({
        title: t('statusUpdateError'),
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      })
    }
  }, [agentStatus, publishAgent, pauseAgent, resumeAgent, t])

  const handleCopyShareLink = useCallback(async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({ title: t('copyShareSuccess') })
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
      copyResetTimeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: t('copyShareError'), variant: 'destructive' })
    }
  }, [shareUrl, t])

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
    }
  }, [])

  const renderStatusButton = (className?: string) =>
    canChangeStatus && statusLabel ? (
      <Button
        type="button"
        variant={statusButtonVariant}
        className={cn('shrink-0 gap-2 text-sm h-11 px-3 lg:h-9', className)}
        disabled={isSaving}
        onClick={() => void handleStatusClick()}
      >
        <StatusIcon className="size-4" />
        <span>{isSaving ? t('saving') : statusLabel}</span>
      </Button>
    ) : null

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile: horizontal scroll row. Desktop: vertical flex column filling sidebar. */}
      <nav className="flex overflow-x-auto p-2 gap-1 lg:flex-col lg:flex-1 lg:p-3 lg:gap-0 lg:overflow-visible">
        <div className="flex gap-0.5 lg:flex-col lg:flex-1">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section
            const isCompleted = completedSections.includes(section)
            const SectionIcon = SECTION_ICONS[section]
            const label = t(`sections.${section}`)

            return (
              <Tooltip key={section}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      // Mobile: compact pill with taller touch target, shrink-0 for horizontal scroll
                      'shrink-0 gap-2 text-sm h-11 px-3',
                      // Desktop: full-width left-aligned row
                      'lg:w-full lg:justify-start lg:px-2 lg:h-9',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                    onClick={() => handleClick(section)}
                  >
                    <SectionIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="lg:flex-1 text-left truncate">{label}</span>
                    {isCompleted && (
                      <CheckCircle2 className="size-3 text-green-600 dark:text-green-400 shrink-0" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  {label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          {renderStatusButton()}
          {showShareLink && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => void handleCopyShareLink()}
              aria-label={t('copyShareLink')}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          )}
        </div>

        {/* Status, share link, and progress — desktop only (no room in horizontal mobile strip) */}
        <div className="hidden lg:block mt-auto pt-3 border-t space-y-2">
          {renderStatusButton('w-full')}

          {showShareLink && (
            <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                {shareUrl}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => void handleCopyShareLink()}
                aria-label={t('copyShareLink')}
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('progress')}</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>
      </nav>
    </TooltipProvider>
  )
}

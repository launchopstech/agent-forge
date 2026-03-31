'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle2, User, SlidersHorizontal, Zap, BookOpen, Radio } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Progress } from '@forge/ui/src/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@forge/ui/src/tooltip'
import { cn } from '@forge/ui/src/utils'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { BuilderSection } from '../types'

const SECTIONS: BuilderSection[] = ['identity', 'behaviour', 'actions', 'knowledge', 'channels']

const SECTION_ICONS: Record<BuilderSection, React.ElementType> = {
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
  const { activeSection, completedSections } = useAgentBuilderStore()

  const progressPercent = Math.round((completedSections.length / SECTIONS.length) * 100)

  const handleClick = useCallback(
    (section: BuilderSection) => {
      router.push(`/agents/${agentId}/${section}`)
    },
    [router, agentId]
  )

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

        {/* Progress — desktop only (no room in horizontal mobile strip) */}
        <div className="hidden lg:block mt-auto pt-3 border-t space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('progress')}</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </nav>
    </TooltipProvider>
  )
}

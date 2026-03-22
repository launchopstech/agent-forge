'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle2, User, SlidersHorizontal, Zap, BookOpen, Radio } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Progress } from '@forge/ui/src/progress'
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
    // Mobile: horizontal scroll row. Desktop: vertical flex column filling sidebar.
    <nav className="flex overflow-x-auto p-2 gap-1 md:flex-col md:flex-1 md:p-3 md:gap-0 md:overflow-visible">
      <div className="flex gap-0.5 md:flex-col md:flex-1">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section
          const isCompleted = completedSections.includes(section)
          const SectionIcon = SECTION_ICONS[section]

          return (
            <Button
              key={section}
              variant="ghost"
              className={cn(
                // Mobile: compact pill, shrink-0 so it doesn't collapse in horizontal scroll
                'shrink-0 gap-2 text-sm h-9 px-3',
                // Desktop: full-width left-aligned row
                'md:w-full md:justify-start md:px-2',
                isActive && 'bg-accent text-accent-foreground font-medium'
              )}
              onClick={() => handleClick(section)}
            >
              <SectionIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="md:flex-1 text-left truncate">{t(`sections.${section}`)}</span>
              {isCompleted && (
                <CheckCircle2 className="size-3 text-green-600 dark:text-green-400 shrink-0" />
              )}
            </Button>
          )
        })}
      </div>

      {/* Progress — desktop only (no room in horizontal mobile strip) */}
      <div className="hidden md:block mt-auto pt-3 border-t space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('progress')}</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>
    </nav>
  )
}

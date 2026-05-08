'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@forge/ui/src/sheet'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import { fetchAgent, createAgent } from '../api/agents.api'
import { BuilderNav } from './BuilderNav'
import { TestChatPanel } from './TestChatPanel'
import { IdentitySection } from './builder-sections/IdentitySection'
import { BehaviourSection } from './builder-sections/BehaviourSection'
import { ActionsSection } from './builder-sections/ActionsSection'
import { KnowledgeSection } from './builder-sections/KnowledgeSection'
import { ChannelsSection } from './builder-sections/ChannelsSection'
import type { BuilderSection } from '../types'

const SECTION_ORDER: BuilderSection[] = [
  'identity',
  'behaviour',
  'actions',
  'knowledge',
  'channels',
]

const BuilderFooter = React.memo(function BuilderFooter({
  section,
  agentId,
}: {
  section: BuilderSection
  agentId: string
}) {
  const router = useRouter()
  const t = useTranslations('agentHub.builder')
  const { markSectionCompleted, draftAgent, saveDraft } = useAgentBuilderStore()
  const [isCreating, setIsCreating] = useState(false)
  const builderBase = `/agents/${agentId}`
  const idx = SECTION_ORDER.indexOf(section)
  const prevSection = idx > 0 ? SECTION_ORDER[idx - 1] : null
  const nextSection = idx < SECTION_ORDER.length - 1 ? SECTION_ORDER[idx + 1] : null
  const isLast = nextSection === null

  const handleBack = useCallback(() => {
    if (prevSection) router.push(`${builderBase}/${prevSection}`)
  }, [prevSection, router, builderBase])

  const handleNext = useCallback(() => {
    markSectionCompleted(section)
    if (nextSection) router.push(`${builderBase}/${nextSection}`)
  }, [section, nextSection, markSectionCompleted, router, builderBase])

  const handleFinish = useCallback(async () => {
    markSectionCompleted(section)
    if (agentId === 'new') {
      setIsCreating(true)
      try {
        await createAgent({
          name: draftAgent.identity.name || 'Untitled Agent',
          uiConfig: { channels: draftAgent.channels },
        })
        router.push('/agents')
      } finally {
        setIsCreating(false)
      }
    } else {
      await saveDraft()
      router.push('/agents')
    }
  }, [agentId, draftAgent, markSectionCompleted, section, saveDraft, router])

  return (
    <div className="shrink-0 border-t bg-background px-4 lg:px-6 py-3 flex justify-between">
      {prevSection ? (
        <Button variant="outline" onClick={handleBack}>
          {t('back')}
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={isLast ? () => void handleFinish() : handleNext}
        disabled={isLast && isCreating}
      >
        {isLast ? (isCreating ? t('saving') : t('finish')) : t('next')}
      </Button>
    </div>
  )
})

interface AgentBuilderProps {
  agentId: string
  section: BuilderSection
}

function SectionContent({ section }: { section: BuilderSection }) {
  switch (section) {
    case 'identity':
      return <IdentitySection />
    case 'behaviour':
      return <BehaviourSection />
    case 'actions':
      return <ActionsSection />
    case 'knowledge':
      return <KnowledgeSection />
    case 'channels':
      return <ChannelsSection />
  }
}

export const AgentBuilder = React.memo(function AgentBuilder({
  agentId,
  section,
}: AgentBuilderProps) {
  const t = useTranslations('agentHub.builder')
  const {
    setActiveSection,
    setAgentId,
    hydrateFromAgent,
    agentId: storedAgentId,
    draftAgent,
  } = useAgentBuilderStore()
  const hydrated = useRef(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    setActiveSection(section)
  }, [section, setActiveSection])

  useEffect(() => {
    setAgentId(agentId === 'new' ? null : agentId)
  }, [agentId, setAgentId])

  useEffect(() => {
    if (agentId === 'new') return
    if (storedAgentId === agentId && hydrated.current) return

    hydrated.current = true
    void fetchAgent(agentId).then((agent) => {
      if (agent) hydrateFromAgent(agent)
    })
  }, [agentId, storedAgentId, hydrateFromAgent])

  const handleOpenChat = useCallback(() => setIsChatOpen(true), [])
  const handleCloseChat = useCallback(() => setIsChatOpen(false), [])

  return (
    <>
      <div className="flex flex-col h-full min-h-0 lg:grid lg:grid-cols-[168px_1fr_300px] lg:overflow-hidden">
        {/* Left nav — horizontal scroll on mobile, icon-only on tablet, full sidebar on desktop */}
        <aside className="lg:border-r bg-muted/30 flex flex-col shrink-0 lg:overflow-y-auto border-b lg:border-b-0">
          {/* Title block — desktop only */}
          <div className="hidden lg:flex flex-col px-4 py-3 shrink-0">
            <div className="font-semibold text-sm truncate">
              {draftAgent.identity.name || t('untitled')}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{t('buildingAgent')}</div>
          </div>
          <BuilderNav agentId={agentId} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <SectionContent section={section} />
          </div>
          <BuilderFooter section={section} agentId={agentId} />
        </main>

        {/* Right: test chat — hidden on mobile/tablet, fixed column on desktop */}
        <aside className="hidden lg:flex border-l flex-col overflow-hidden">
          <TestChatPanel />
        </aside>
      </div>

      {/* Mobile/tablet: FAB to open test chat */}
      <Button
        size="icon"
        className="lg:hidden fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
        onClick={handleOpenChat}
        aria-label={t('openTestChat')}
      >
        <MessageCircle className="size-5" />
      </Button>

      {/* Mobile/tablet: Sheet for test chat */}
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="bottom" className="h-[70vh] p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{t('openTestChat')}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
              <span className="text-sm font-medium">{t('openTestChat')}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCloseChat}
                aria-label={t('closeTestChat')}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TestChatPanel />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
})

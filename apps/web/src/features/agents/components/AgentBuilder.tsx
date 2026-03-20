'use client'

import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import { fetchAgent } from '../api/agents.api'
import { BuilderNav } from './BuilderNav'
import { TestChatPanel } from './TestChatPanel'
import { IdentitySection } from './builder-sections/IdentitySection'
import { BehaviourSection } from './builder-sections/BehaviourSection'
import { ActionsSection } from './builder-sections/ActionsSection'
import { KnowledgeSection } from './builder-sections/KnowledgeSection'
import { ChannelsSection } from './builder-sections/ChannelsSection'
import type { BuilderSection } from '../types'

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

  // Sync URL section → Zustand (so BuilderNav highlights the right item)
  useEffect(() => {
    setActiveSection(section)
  }, [section, setActiveSection])

  // Register agentId in store so section components can build navigation URLs
  useEffect(() => {
    setAgentId(agentId === 'new' ? null : agentId)
  }, [agentId, setAgentId])

  // Hydrate draft when opening an existing agent for the first time
  useEffect(() => {
    if (agentId === 'new') return
    if (storedAgentId === agentId && hydrated.current) return

    hydrated.current = true
    void fetchAgent(agentId).then((agent) => {
      if (agent) hydrateFromAgent(agent)
    })
  }, [agentId, storedAgentId, hydrateFromAgent])

  return (
    <div className="flex flex-col md:grid md:grid-cols-[168px_1fr_300px] h-[calc(100vh-3.5rem)] md:overflow-hidden">
      {/* Left nav — horizontal scroll on mobile, fixed sidebar on desktop */}
      <aside className="md:border-r bg-muted/30 flex flex-col shrink-0 md:overflow-y-auto border-b md:border-b-0">
        <div className="px-4 py-3 shrink-0">
          <div className="font-semibold text-sm truncate">
            {draftAgent.identity.name || t('untitled')}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{t('buildingAgent')}</div>
        </div>
        <BuilderNav agentId={agentId} />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <SectionContent section={section} />
      </main>

      {/* Right: test chat — full width on mobile, fixed column on desktop */}
      <aside className="md:border-l flex flex-col border-t md:border-t-0 h-[360px] md:h-auto md:overflow-hidden">
        <TestChatPanel />
      </aside>
    </div>
  )
})

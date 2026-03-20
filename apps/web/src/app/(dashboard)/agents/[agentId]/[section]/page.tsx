import { notFound } from 'next/navigation'
import { AgentBuilder } from '@/features/agents/components/AgentBuilder'
import type { BuilderSection } from '@/features/agents/types'

const VALID_SECTIONS: BuilderSection[] = [
  'identity',
  'behaviour',
  'actions',
  'knowledge',
  'channels',
]

interface AgentBuilderPageProps {
  params: Promise<{
    agentId: string
    section: string
  }>
}

export default async function AgentBuilderPage({ params }: AgentBuilderPageProps) {
  const { agentId, section } = await params

  if (!VALID_SECTIONS.includes(section as BuilderSection)) {
    notFound()
  }

  return <AgentBuilder agentId={agentId} section={section as BuilderSection} />
}

import { cache } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@forge/config/src/site'
import { PublicChatWidget } from '@/components/PublicChatWidget'
import { fetchPublicAgent } from '@/features/agents/api/chat.api'

export const dynamic = 'force-dynamic'

interface PublicChatPageProps {
  params: Promise<{ agentId: string }>
  searchParams: Promise<{ token?: string | string[] }>
}

function searchToken(searchParams: { token?: string | string[] }): string {
  const token = searchParams.token
  return Array.isArray(token) ? (token[0] ?? '') : (token ?? '')
}

const loadPublicAgent = cache(async (agentId: string, token: string) => {
  if (!token.trim()) return null

  try {
    return await fetchPublicAgent(agentId, token, { cache: 'no-store' })
  } catch {
    return null
  }
})

async function UnavailableAgent() {
  const t = await getTranslations('agentHub.publicChat')

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-normal">{t('unavailableTitle')}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t('unavailableDescription')}</p>
      </div>
    </main>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: PublicChatPageProps): Promise<Metadata> {
  const { agentId } = await params
  const token = searchToken(await searchParams)
  const agent = await loadPublicAgent(agentId, token)
  const t = await getTranslations('agentHub.publicChat')
  const title = agent
    ? t('metadataTitle', { agentName: agent.name })
    : t('unavailableMetadataTitle')
  const description = agent
    ? t('metadataDescription', { agentName: agent.name })
    : t('unavailableMetadataDescription')

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url.replace(/\/$/, '')}/chat/${agentId}`,
      siteName: siteConfig.name,
      type: 'website',
    },
  }
}

export default async function PublicChatPage({ params, searchParams }: PublicChatPageProps) {
  const { agentId } = await params
  const token = searchToken(await searchParams)
  const agent = await loadPublicAgent(agentId, token)

  if (!agent) return <UnavailableAgent />

  return (
    <PublicChatWidget
      agentId={agent.id}
      agentName={agent.name}
      welcomeMessage={agent.welcomeMessage}
      shareToken={token}
    />
  )
}

'use client'

import { useSearchParams } from 'next/navigation'
import { ChannelSetupPage } from '@/features/channels/components/ChannelSetupPage'

interface SetupPageProps {
  params: { channelType: string }
}

export default function ChannelSetupRoute({ params: _params }: SetupPageProps) {
  const searchParams = useSearchParams()
  const channelId = searchParams.get('id') ?? ''

  if (!channelId) {
    return (
      <div className="p-6 text-muted-foreground">
        No channel ID provided. Return to{' '}
        <a href="/dashboard/channels" className="underline">
          Channels
        </a>
        .
      </div>
    )
  }

  return <ChannelSetupPage channelId={channelId} />
}

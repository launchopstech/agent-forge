'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Monitor, MessageCircle, Mail, Hash, ClipboardCopy, Check } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Badge } from '@forge/ui/src/badge'
import { cn } from '@forge/ui/src/utils'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

const AVAILABLE_CHANNELS = [
  {
    id: 'web',
    labelKey: 'channelWeb',
    Icon: Monitor,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'whatsapp',
    labelKey: 'channelWhatsApp',
    Icon: MessageCircle,
    iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    id: 'email',
    labelKey: 'channelEmail',
    Icon: Mail,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'slack',
    labelKey: 'channelSlack',
    Icon: Hash,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
]

export function ChannelsSection() {
  const t = useTranslations('agentHub.builder.channels')
  const tCommon = useTranslations('agentHub.builder')
  const router = useRouter()
  const { draftAgent, toggleChannel, markSectionCompleted, agentId } = useAgentBuilderStore()
  const { channels, identity } = draftAgent
  const [copied, setCopied] = useState(false)
  const builderBase = `/agents/${agentId ?? 'new'}`

  const handleFinish = useCallback(() => {
    markSectionCompleted('channels')
  }, [markSectionCompleted])

  const handleBack = useCallback(() => {
    router.push(`${builderBase}/knowledge`)
  }, [router, builderBase])

  const embedCode = `<script src="https://cdn.agentforge.io/widget.js"
  data-agent="${identity.name || 'my-agent'}"
  data-channels="${channels.join(',')}"
></script>`

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [embedCode])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {AVAILABLE_CHANNELS.map(({ id, labelKey, Icon, iconBg }) => {
          const isActive = channels.includes(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleChannel(id)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                isActive
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:shadow-sm bg-card'
              )}
            >
              <span
                className={cn(
                  'size-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  iconBg
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm block">{t(labelKey as 'channelWeb')}</span>
                {isActive && (
                  <Badge variant="default" className="mt-0.5 text-[10px] h-4 px-1">
                    {t('active')}
                  </Badge>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {channels.includes('web') && (
        <div className="max-w-lg space-y-2">
          <h3 className="text-sm font-medium">{t('embedCode')}</h3>
          <p className="text-xs text-muted-foreground">{t('embedCodeHint')}</p>
          <div className="relative">
            <pre className="bg-[#1e1e2e] text-[#cdd6f4] rounded-xl p-4 text-xs font-mono leading-relaxed overflow-x-auto">
              {embedCode}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-[#cdd6f4] transition-colors"
              title={t('copy')}
            >
              {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {tCommon('back')}
        </Button>
        <Button onClick={handleFinish}>{t('finish')}</Button>
      </div>
    </div>
  )
}

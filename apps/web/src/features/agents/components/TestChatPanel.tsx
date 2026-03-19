'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Send, Trash2 } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { ScrollArea } from '@forge/ui/src/scroll-area'
import { cn } from '@forge/ui/src/utils'
import { useAgentBuilderStore } from '../store/agent-builder.store'

export const TestChatPanel = React.memo(function TestChatPanel() {
  const t = useTranslations('agentHub.testChat')
  const { testMessages, draftAgent, addTestMessage, clearTestMessages } = useAgentBuilderStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [testMessages])

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    addTestMessage({ role: 'user', content: trimmed })
    setInput('')

    // Simulated assistant reply
    setTimeout(() => {
      addTestMessage({
        role: 'assistant',
        content: draftAgent.identity.welcomeMessage || t('defaultReply'),
      })
    }, 600)
  }, [addTestMessage, draftAgent.identity.welcomeMessage, input, t])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          <div>
            <div className="font-medium text-sm">{t('title')}</div>
            <div className="text-xs text-muted-foreground">
              {draftAgent.identity.name || t('agentName')}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={clearTestMessages}
          title={t('clear')}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        {testMessages.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center text-sm text-muted-foreground">
            {t('emptyState')}
          </div>
        ) : (
          <div className="space-y-4">
            {testMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-2 items-end', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <div
                    className={cn(
                      'px-3 py-2 text-sm',
                      msg.role === 'user'
                        ? 'rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl bg-primary text-primary-foreground'
                        : 'rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-muted text-foreground'
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && (
                    <span className="text-[10px] text-muted-foreground px-1">
                      {t('confidence', { value: 98 })}
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-[10px] text-muted-foreground px-1',
                      msg.role === 'user' && 'text-right'
                    )}
                  >
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-4 py-3 flex gap-2 shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
          <Send className="size-4" />
          <span className="sr-only">{t('send')}</span>
        </Button>
      </div>
    </div>
  )
})

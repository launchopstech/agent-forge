'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Trash2 } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { cn } from '@forge/ui/src/utils'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  type PromptInputMessage,
} from '@forge/ai-ui'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import { streamChat } from '../api/chat.api'
import { getAccessToken } from '@forge/auth/client-registry'
import { toast } from '@/hooks/use-toast'

export const TestChatPanel = React.memo(function TestChatPanel() {
  const t = useTranslations('agentHub.testChat')
  const {
    testMessages,
    draftAgent,
    agentId,
    addTestMessage,
    appendToLastTestMessage,
    clearTestMessages,
  } = useAgentBuilderStore()
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const handleSend = useCallback(
    ({ text }: PromptInputMessage) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping || isStreaming || !agentId) return

      addTestMessage({ role: 'user', content: trimmed })
      setIsTyping(true)

      const controller = new AbortController()
      abortRef.current = controller

      const messages = useAgentBuilderStore
        .getState()
        .testMessages.map(({ role, content }) => ({ role, content }))

      void (async () => {
        addTestMessage({ role: 'assistant', content: '' })
        let firstChunk = true
        try {
          for await (const chunk of streamChat(
            agentId,
            messages,
            getAccessToken,
            controller.signal
          )) {
            if (firstChunk) {
              setIsTyping(false)
              setIsStreaming(true)
              firstChunk = false
            }
            appendToLastTestMessage(chunk)
          }
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            toast({
              title: t('errorTitle'),
              description: (err as Error).message,
              variant: 'destructive',
            })
          }
        } finally {
          setIsTyping(false)
          setIsStreaming(false)
        }
      })()
    },
    [addTestMessage, appendToLastTestMessage, agentId, isTyping, isStreaming, t]
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
          onClick={isStreaming ? undefined : clearTestMessages}
          disabled={isStreaming}
          title={t('clear')}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <Conversation className="flex-1">
        <ConversationContent className="gap-4">
          {testMessages.length === 0 ? (
            <ConversationEmptyState title={t('emptyState')} />
          ) : (
            <>
              {testMessages.map((msg) => (
                <Message key={msg.id} from={msg.role}>
                  <MessageContent>
                    {msg.role === 'assistant' ? (
                      <MessageResponse>{msg.content}</MessageResponse>
                    ) : (
                      msg.content
                    )}
                  </MessageContent>
                  <span
                    className={cn(
                      'text-[10px] text-muted-foreground px-1',
                      msg.role === 'user' && 'text-right'
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Message>
              ))}
              {isTyping && (
                <Message from="assistant">
                  <MessageContent>
                    <span className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </span>
                  </MessageContent>
                  <span className="text-[10px] text-muted-foreground px-1">{t('typing')}</span>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="border-t px-3 py-3 shrink-0">
        <PromptInput onSubmit={handleSend}>
          <PromptInputTextarea placeholder={t('inputPlaceholder')} className="min-h-[40px]" />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit
              status={isTyping ? 'submitted' : isStreaming ? 'streaming' : undefined}
              disabled={isTyping || isStreaming || !agentId}
              title={!agentId ? t('saveAgentFirst') : undefined}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
})

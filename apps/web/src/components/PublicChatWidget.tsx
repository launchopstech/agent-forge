'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bot, ShieldCheck } from 'lucide-react'
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
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@forge/ai-ui'
import { streamPublicChat, type ChatMessage } from '@/features/agents/api/chat.api'

interface PublicChatMessage extends ChatMessage {
  id: string
  timestamp: Date
}

interface PublicChatWidgetProps {
  agentId: string
  agentName: string
  welcomeMessage: string | null
  shareToken: string
}

function messageId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function toChatMessages(messages: PublicChatMessage[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }))
}

export function PublicChatWidget({
  agentId,
  agentName,
  welcomeMessage,
  shareToken,
}: PublicChatWidgetProps) {
  const t = useTranslations('agentHub.publicChat')
  const initialWelcome = useMemo<PublicChatMessage | null>(() => {
    const trimmed = welcomeMessage?.trim()
    if (!trimmed) return null
    return {
      id: 'welcome-message',
      role: 'assistant',
      content: trimmed,
      timestamp: new Date(),
    }
  }, [welcomeMessage])

  const [messages, setMessages] = useState<PublicChatMessage[]>(
    initialWelcome ? [initialWelcome] : []
  )
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const appendToAssistantMessage = useCallback((messageId: string, chunk: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, content: message.content + chunk } : message
      )
    )
  }, [])

  const handleSend = useCallback(
    ({ text }: PromptInputMessage) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping || isStreaming) return

      setError(null)
      const controller = new AbortController()
      abortRef.current = controller

      const userMessage: PublicChatMessage = {
        id: messageId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }
      const assistantMessage: PublicChatMessage = {
        id: messageId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      const nextMessages = [...messages, userMessage]

      setMessages([...nextMessages, assistantMessage])
      setIsTyping(true)

      void (async () => {
        let firstChunk = true
        try {
          for await (const chunk of streamPublicChat(
            agentId,
            toChatMessages(nextMessages),
            shareToken,
            controller.signal
          )) {
            if (firstChunk) {
              setIsTyping(false)
              setIsStreaming(true)
              firstChunk = false
            }
            appendToAssistantMessage(assistantMessage.id, chunk)
          }
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            setError((err as Error).message)
          }
        } finally {
          setIsTyping(false)
          setIsStreaming(false)
        }
      })()
    },
    [agentId, appendToAssistantMessage, isStreaming, isTyping, messages, shareToken]
  )

  return (
    <section className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted">
              <Bot className="size-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">{agentName}</h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                <span>{t('verifiedShareLink')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Conversation className="mx-auto flex w-full max-w-3xl flex-1">
        <ConversationContent className="gap-4 px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState title={t('emptyState', { agentName })} />
          ) : (
            <>
              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === 'assistant' ? (
                      message.content ? (
                        <MessageResponse>{message.content}</MessageResponse>
                      ) : (
                        <span className="flex gap-1 py-1">
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                          <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                        </span>
                      )
                    ) : (
                      message.content
                    )}
                  </MessageContent>
                  <span
                    className={cn(
                      'px-1 text-[10px] text-muted-foreground',
                      message.role === 'user' && 'text-right'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </Message>
              ))}
              {isTyping && messages[messages.length - 1]?.content !== '' && (
                <Message from="assistant">
                  <MessageContent>
                    <span className="flex gap-1 py-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </span>
                  </MessageContent>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <footer className="border-t px-4 py-4 sm:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-3">
          {error && (
            <div role="alert" className="rounded-md border border-destructive/40 px-3 py-2 text-sm">
              {error}
            </div>
          )}
          <PromptInput onSubmit={handleSend}>
            <PromptInputTextarea
              placeholder={t('inputPlaceholder', { agentName })}
              className="min-h-[44px]"
            />
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit
                status={isTyping ? 'submitted' : isStreaming ? 'streaming' : undefined}
                disabled={isTyping || isStreaming}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </footer>
    </section>
  )
}

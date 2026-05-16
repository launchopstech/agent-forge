'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { cn } from '@forge/ui/src/utils'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '@forge/ai-ui'
import {
  createConversation,
  deleteConversation,
  fetchConversation,
  fetchConversations,
  sendMessage,
  type ConversationMessage,
  type ConversationSummary,
} from '../api/conversations.api'

// ─── Props ──────────────────────────────────────────────────────────────────

interface ConversationPanelProps {
  agentId: string
  className?: string
}

// ─── Component ──────────────────────────────────────────────────────────────

export const ConversationPanel = React.memo(function ConversationPanel({
  agentId,
  className,
}: ConversationPanelProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  // Load conversations and auto-create if none
  useEffect(() => {
    let cancelled = false

    void (async () => {
      setIsLoading(true)
      try {
        const list = await fetchConversations(agentId)
        if (cancelled) return
        if (list.length > 0) {
          setConversations(list)
          setActiveConvId(list[0]!.id)
        } else {
          const created = await createConversation(agentId)
          if (cancelled) return
          const summary: ConversationSummary = {
            id: created.id,
            title: null,
            createdAt: created.createdAt,
            updatedAt: created.createdAt,
          }
          setConversations([summary])
          setActiveConvId(created.id)
        }
      } catch {
        // silently ignored — UI shows empty state
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
      abortRef.current?.abort()
    }
  }, [agentId])

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return

    void (async () => {
      try {
        const detail = await fetchConversation(agentId, activeConvId)
        setMessages(detail.messages)
      } catch {
        setMessages([])
      }
    })()
  }, [agentId, activeConvId])

  const handleNewConversation = useCallback(async () => {
    try {
      const created = await createConversation(agentId)
      const summary: ConversationSummary = {
        id: created.id,
        title: null,
        createdAt: created.createdAt,
        updatedAt: created.createdAt,
      }
      setConversations((prev) => [summary, ...prev])
      setActiveConvId(created.id)
      setMessages([])
    } catch {
      // ignore
    }
  }, [agentId])

  const handleSend = useCallback(
    ({ text }: PromptInputMessage) => {
      const trimmed = text.trim()
      if (!trimmed || isSending || !activeConvId) return

      const userMsg: ConversationMessage = {
        id: `tmp-user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        metadata: {},
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsSending(true)

      void (async () => {
        try {
          const response = await sendMessage(agentId, activeConvId, trimmed)
          const assistantMsg: ConversationMessage = {
            id: `tmp-assistant-${Date.now()}`,
            role: 'assistant',
            content: response.content,
            metadata: {},
            createdAt: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, assistantMsg])
        } catch {
          // silently ignore
        } finally {
          setIsSending(false)
        }
      })()
    },
    [agentId, activeConvId, isSending]
  )

  const handleDeleteConversation = useCallback(
    async (convId: string) => {
      try {
        await deleteConversation(agentId, convId)
        setConversations((prev) => prev.filter((c) => c.id !== convId))
        if (activeConvId === convId) {
          const remaining = conversations.filter((c) => c.id !== convId)
          if (remaining.length > 0) {
            setActiveConvId(remaining[0]!.id)
          } else {
            const created = await createConversation(agentId)
            const summary: ConversationSummary = {
              id: created.id,
              title: null,
              createdAt: created.createdAt,
              updatedAt: created.createdAt,
            }
            setConversations([summary])
            setActiveConvId(created.id)
            setMessages([])
          }
        }
      } catch {
        // ignore
      }
    },
    [agentId, activeConvId, conversations]
  )

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Conversations</span>
          {conversations.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {conversations.length}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNewConversation}
          disabled={isSending || isLoading}
          title="New conversation"
        >
          <PlusCircle className="size-4" />
        </Button>
      </div>

      {/* Conversation selector (when multiple) */}
      {conversations.length > 1 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={cn(
                'rounded px-2 py-1 text-xs whitespace-nowrap transition-colors',
                activeConvId === conv.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {conv.title ?? new Date(conv.createdAt).toLocaleDateString()}
            </button>
          ))}
        </div>
      )}

      {/* Chat area */}
      <div className="relative min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="animate-pulse text-sm text-muted-foreground">Loading…</span>
          </div>
        ) : (
          <Conversation className="h-full">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState>
                  <span className="text-sm text-muted-foreground">
                    Send a message to start the conversation.
                  </span>
                </ConversationEmptyState>
              ) : (
                messages.map((msg) =>
                  msg.role === 'user' ? (
                    <Message key={msg.id} from="user">
                      <MessageContent>{msg.content}</MessageContent>
                    </Message>
                  ) : (
                    <Message key={msg.id} from="assistant">
                      <MessageResponse>{msg.content}</MessageResponse>
                    </Message>
                  )
                )
              )}
            </ConversationContent>

            <PromptInput onSubmit={handleSend}>
              <PromptInputTextarea placeholder="Type a message…" />
              <PromptInputFooter>
                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </Conversation>
        )}
      </div>
    </div>
  )
})

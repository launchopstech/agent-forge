'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Trash2, Bot, User } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { triggerTest as _triggerTest } from '../api/channels.api'
import type { ConsoleMessage } from '../types'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

interface TestConsoleProps {
  channelId: string
  /** Display name of the channel (e.g. "Dev Test") */
  channelName?: string
  triggerTest?: typeof _triggerTest
}

export function TestConsole({
  channelId,
  channelName = 'Test Channel',
  triggerTest = _triggerTest,
}: TestConsoleProps) {
  const [messages, setMessages] = useState<ConsoleMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  // Each session gets a unique fromId so that clearing the console starts a
  // fresh server-side conversation (findOrCreate keys on fromId).
  const [sessionFromId, setSessionFromId] = useState(() => crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)
  // Always call the latest triggerTest prop without adding it to useCallback deps
  // (adding it would cause the button to become disabled mid-play due to re-renders)
  const triggerTestRef = useRef(triggerTest)
  triggerTestRef.current = triggerTest

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isSending) return

    const userMsg: ConsoleMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsSending(true)
    setError(null)

    try {
      const result = await triggerTestRef.current(channelId, { text, fromId: sessionFromId })

      if (!result.ok) {
        setError(result.reason ?? 'No routing rule matched')
        return
      }

      if (result.conversationId) {
        setConversationId(result.conversationId)
      }

      const assistantMsg: ConsoleMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: result.reply ?? '(no reply)',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setError('Request failed — check routing rules and agent configuration')
    } finally {
      setIsSending(false)
    }
  }, [channelId, input, isSending, sessionFromId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleClear = () => {
    setMessages([])
    setConversationId(undefined)
    setError(null)
    setSessionFromId(crypto.randomUUID()) // new fromId → fresh server-side conversation
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="font-medium text-sm">{channelName} — Test Console</p>
          {conversationId && (
            <p className="text-xs text-muted-foreground">conv: {conversationId.slice(0, 8)}…</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={messages.length === 0}
          className="gap-1 text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[480px]">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <Bot className="mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">Send a message to test the agent pipeline</p>
            <p className="text-xs mt-1 opacity-60">Requires at least one routing rule</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {msg.role === 'user' ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted rounded-tl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p
                className={`mt-1 text-[10px] ${
                  msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm text-muted-foreground">
              <span className="inline-flex gap-0.5">
                <span className="animate-bounce [animation-delay:0ms]">·</span>
                <span className="animate-bounce [animation-delay:150ms]">·</span>
                <span className="animate-bounce [animation-delay:300ms]">·</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-1 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={isSending}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          size="icon"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

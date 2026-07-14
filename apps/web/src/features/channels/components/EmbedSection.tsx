'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Code2, Copy, Info, Plus, X } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Label } from '@forge/ui/src/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { toast } from '@/hooks/use-toast'
import { updateChannel } from '../api/channels.api'
import type { WebsiteChannelConfig, WorkspaceChannel } from '../types'
import type { Agent } from '@/features/agents/types'

const WIDGET_CDN = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://mindrithm.ai/widget.js'
const WIDGET_API_URL =
  process.env.NEXT_PUBLIC_FORGE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORGE_API_URL ??
  'https://api.mindrithm.ai'
const DEFAULT_BRAND_COLOR = '#4f2edc'
const DEFAULT_MODE = 'floating'
const DEFAULT_POSITION = 'bottom-right'
const HEX_COLOR_RE = /^#[0-9a-f]{6}$/i

interface EmbedSectionProps {
  channel: WorkspaceChannel
  agents: Agent[]
  onConfigSaved: () => void
}

function normalizeAllowedDomain(value: string): string {
  const domain = value.trim().toLowerCase()
  if (!domain) return ''
  if (domain.includes('://')) throw new Error('Do not include http:// or https://.')
  if (/[/?#\s]/.test(domain)) throw new Error('Enter only the domain, with no paths or spaces.')
  if (domain.includes('*')) throw new Error('Add each subdomain separately.')

  try {
    const parsed = new URL(`https://${domain}`)
    if (!parsed.hostname || parsed.host !== domain) throw new Error()
    return parsed.host
  } catch {
    throw new Error('Enter a valid domain, such as example.com or app.example.com.')
  }
}

function normalizeBrandColor(value: string): string {
  const color = value.trim()
  return HEX_COLOR_RE.test(color) ? color.toLowerCase() : DEFAULT_BRAND_COLOR
}

function normalizeDisplayMode(value: unknown): 'floating' | 'inline' {
  return value === 'inline' || value === 'floating' ? value : DEFAULT_MODE
}

function normalizeWidgetPosition(value: unknown): 'bottom-right' | 'bottom-left' {
  return value === 'bottom-left' || value === 'bottom-right' ? value : DEFAULT_POSITION
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function EmbedSection({ channel, agents, onConfigSaved }: EmbedSectionProps) {
  const cfg = channel.config as WebsiteChannelConfig

  const [selectedAgentId, setSelectedAgentId] = useState(cfg.agentId ?? '')
  const [brandName, setBrandName] = useState(cfg.brandName ?? '')
  const [brandColor, setBrandColor] = useState(
    typeof cfg.brandColor === 'string' ? normalizeBrandColor(cfg.brandColor) : DEFAULT_BRAND_COLOR
  )
  const [mode, setMode] = useState<'floating' | 'inline'>(normalizeDisplayMode(cfg.mode))
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>(
    normalizeWidgetPosition(cfg.position)
  )
  const [allowedDomains, setAllowedDomains] = useState<string[]>(
    Array.isArray(cfg.allowedDomains) ? cfg.allowedDomains : []
  )
  const [domainInput, setDomainInput] = useState('')
  const [domainError, setDomainError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
    }
  }, [])

  const selectedAgent = agents.find((a) => a.id === selectedAgentId)
  const shareToken = selectedAgent?.shareToken
  const safeBrandColor = normalizeBrandColor(brandColor)
  const widgetAttributes =
    selectedAgentId && shareToken
      ? [
          `data-agent-id="${escapeAttribute(selectedAgentId)}"`,
          `data-share-token="${escapeAttribute(shareToken)}"`,
          `data-api-url="${escapeAttribute(WIDGET_API_URL)}"`,
          brandName ? `data-brand-name="${escapeAttribute(brandName)}"` : null,
          `data-brand-color="${escapeAttribute(safeBrandColor)}"`,
          `data-mode="${mode}"`,
          mode === 'floating' ? `data-position="${position}"` : null,
        ].filter((attr): attr is string => Boolean(attr))
      : []

  const formattedWidgetAttributes = widgetAttributes.map((attr) => `  ${attr}`).join('\n')
  const snippet =
    selectedAgentId && shareToken
      ? mode === 'inline'
        ? `<forge-chat
${formattedWidgetAttributes}
></forge-chat>
<script
  src="${escapeAttribute(WIDGET_CDN)}"
  async
></script>`
        : `<script
  src="${escapeAttribute(WIDGET_CDN)}"
${formattedWidgetAttributes}
  async
></script>`
      : null
  const showAllowedDomainWarning = Boolean(snippet && allowedDomains.length === 0)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await updateChannel(channel.id, {
        config: {
          ...channel.config,
          agentId: selectedAgentId,
          brandName,
          brandColor: safeBrandColor,
          mode,
          position,
          allowedDomains,
        },
      })
      toast({ title: 'Embed configuration saved' })
      onConfigSaved()
    } catch {
      toast({ title: 'Failed to save configuration', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }, [
    channel,
    selectedAgentId,
    brandName,
    safeBrandColor,
    mode,
    position,
    allowedDomains,
    onConfigSaved,
  ])

  const handleAddDomain = useCallback(() => {
    try {
      const domain = normalizeAllowedDomain(domainInput)
      if (!domain) return
      setAllowedDomains((current) =>
        current.includes(domain) ? current : [...current, domain].sort()
      )
      setDomainInput('')
      setDomainError(null)
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : 'Enter a valid domain.')
    }
  }, [domainInput])

  const handleRemoveDomain = useCallback((domain: string) => {
    setAllowedDomains((current) => current.filter((item) => item !== domain))
  }, [])

  const handleCopy = useCallback(async () => {
    if (!snippet) return
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      toast({ title: 'Snippet copied to clipboard' })
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
      copyResetTimeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy snippet', variant: 'destructive' })
    }
  }, [snippet])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Left: Config ─────────────────────────────────────────────── */}
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Widget configuration</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Configure the chat widget for this channel. Changes are saved to the channel and
            reflected in the snippet.
          </p>
        </div>

        {/* Agent picker */}
        <div className="space-y-1.5">
          <Label htmlFor="embed-agent">Agent</Label>
          <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
            <SelectTrigger id="embed-agent" className="w-full">
              <SelectValue placeholder="Select an agent…" />
            </SelectTrigger>
            <SelectContent>
              {agents.length === 0 && (
                <SelectItem value="__none" disabled>
                  No agents available
                </SelectItem>
              )}
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  <span className="flex items-center gap-2">
                    {a.name}
                    <span
                      className={`text-[10px] font-medium capitalize ${
                        a.status === 'live'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {a.status}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand name */}
        <div className="space-y-1.5">
          <Label htmlFor="embed-brand-name">Brand name</Label>
          <Input
            id="embed-brand-name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Acme Support"
          />
        </div>

        {/* Brand color */}
        <div className="space-y-1.5">
          <Label htmlFor="embed-brand-color">Brand color</Label>
          <div className="flex items-center gap-2">
            <input
              id="embed-brand-color-swatch"
              type="color"
              value={safeBrandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-9 w-10 shrink-0 cursor-pointer rounded border bg-background p-0.5"
              aria-label="Pick brand color"
            />
            <Input
              id="embed-brand-color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="#4f2edc"
              className="font-mono"
            />
          </div>
        </div>

        {/* Mode */}
        <div className="space-y-1.5">
          <Label>Display mode</Label>
          <div className="flex gap-2">
            {(['floating', 'inline'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  mode === m
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Position — only for floating */}
        {mode === 'floating' && (
          <div className="space-y-1.5">
            <Label htmlFor="embed-position">Position</Label>
            <Select value={position} onValueChange={(v) => setPosition(normalizeWidgetPosition(v))}>
              <SelectTrigger id="embed-position" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom right</SelectItem>
                <SelectItem value="bottom-left">Bottom left</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2 rounded-lg border border-dashed p-4">
          <div>
            <h4 className="text-sm font-semibold">Allowed domains</h4>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Add the domains where this widget is embedded.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Do not include <code>http://</code> or <code>https://</code>. Add subdomains
              separately.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value)
                setDomainError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddDomain()
                }
              }}
              placeholder="example.com"
              aria-label="Allowed domain"
            />
            <Button type="button" variant="outline" onClick={handleAddDomain} className="gap-1.5">
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>

          {domainError && <p className="text-sm text-destructive">{domainError}</p>}

          {allowedDomains.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allowedDomains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium"
                >
                  {domain}
                  <button
                    type="button"
                    onClick={() => handleRemoveDomain(domain)}
                    className="rounded-sm text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${domain}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No domains added yet. Browser widget calls will be blocked until at least one domain
              is allowed.
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? 'Saving…' : 'Save configuration'}
        </Button>
      </div>

      {/* ── Right: Snippet ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Drop-in snippet</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Paste this before the closing <code className="text-xs">&lt;/body&gt;</code> tag.
            </p>
          </div>
          {snippet && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => void handleCopy()}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </div>

        {snippet ? (
          <>
            {showAllowedDomainWarning && (
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 dark:text-amber-200">
                    Add an allowed domain before installing
                  </p>
                  <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                    This snippet is generated, but browser chat requests will be blocked until the
                    client website domain is allowed.
                  </p>
                </div>
              </div>
            )}
            <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 text-[12px] leading-relaxed text-foreground">
              <code>{snippet}</code>
            </pre>
          </>
        ) : selectedAgentId && !shareToken ? (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200">
                Agent not published yet
              </p>
              <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                Publish <strong>{selectedAgent?.name}</strong> from its agent builder to generate
                your embed snippet.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 rounded-lg border border-dashed p-6 text-muted-foreground">
            <Code2 className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm">Select an agent above to generate the embed snippet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

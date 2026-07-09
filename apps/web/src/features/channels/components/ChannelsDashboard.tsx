'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Radio, ExternalLink, Trash2, AlertCircle, Code2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@forge/ui/src/button'
import { Badge } from '@forge/ui/src/badge'
import { Skeleton } from '@forge/ui/src/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@forge/ui/src/dialog'
import { Input } from '@forge/ui/src/input'
import { Label } from '@forge/ui/src/label'
import { toast } from '@/hooks/use-toast'
import {
  fetchChannels as _fetchChannels,
  fetchChannelCatalog as _fetchChannelCatalog,
  createChannel as _createChannel,
  deleteChannel as _deleteChannel,
} from '../api/channels.api'
import type { WorkspaceChannel, ChannelCatalogItem, CreateChannelPayload } from '../types'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

function getChannelSetupHref(channel: Pick<WorkspaceChannel, 'channelType' | 'id'>): string {
  return `/dashboard/channels/${channel.channelType}/setup?id=${encodeURIComponent(channel.id)}`
}

// ─── Create Channel Modal ──────────────────────────────────────────────────────

interface CreateChannelModalProps {
  catalog: ChannelCatalogItem[]
  onCreated: (channel: WorkspaceChannel) => void
  onClose: () => void
  createChannel?: typeof _createChannel
}

function CreateChannelModal({
  catalog,
  onCreated,
  onClose,
  createChannel = _createChannel,
}: CreateChannelModalProps) {
  const [step, setStep] = useState<'pick' | 'configure'>('pick')
  const [selected, setSelected] = useState<ChannelCatalogItem | null>(null)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePick = (item: ChannelCatalogItem) => {
    setSelected(item)
    setName(`My ${item.name}`)
    setStep('configure')
  }

  const handleCreate = async () => {
    if (!selected || !name.trim()) return
    setIsSubmitting(true)
    try {
      const payload: CreateChannelPayload = {
        channelType: selected.type,
        name: name.trim(),
      }
      const channel = await createChannel(payload)
      onCreated(channel)
      toast({ title: `${selected.name} channel created` })
    } catch {
      toast({ title: 'Failed to create channel', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'pick' ? 'Choose a channel type' : `Set up ${selected?.name}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'pick' && (
          <div className="grid grid-cols-2 gap-3 py-2">
            {catalog.map((item) => (
              <button
                key={item.type}
                onClick={() => handlePick(item)}
                className="flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.capabilities.join(', ')}
                </span>
                {item.type === 'test' && (
                  <Badge variant="outline" className="text-xs">
                    No setup needed
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}

        {step === 'configure' && selected && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="channel-name">Channel name</Label>
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Support Bot Test"
              />
            </div>

            {selected.type === 'test' && (
              <p className="text-sm text-muted-foreground">{selected.setupInstructions}</p>
            )}

            {selected.type === 'website' && (
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Create this Website channel to configure the embed snippet, allowed domains, and
                  the agent that answers visitors.
                </p>
              </div>
            )}

            {selected.type !== 'test' && selected.type !== 'website' && (
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Full setup for {selected.name} is coming in Phase 2. Create the channel now and
                  configure credentials later.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'configure' && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setStep('pick')}>
              Back
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? 'Creating…' : 'Create channel'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Channel Card ──────────────────────────────────────────────────────────────

interface ChannelCardProps {
  channel: WorkspaceChannel
  href: string
  onDelete: (id: string) => void
}

function ChannelCard({ channel, href, onDelete }: ChannelCardProps) {
  const isWebsiteChannel = channel.channelType === 'website'
  const ActionIcon = isWebsiteChannel ? Code2 : ExternalLink
  const actionLabel = isWebsiteChannel ? 'Embed' : 'Open'

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">{channel.name}</p>
          <p className="text-sm capitalize text-muted-foreground">{channel.channelType}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[channel.status] ?? ''}`}
        >
          {channel.status}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={href}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ActionIcon className="h-3 w-3" />
          {actionLabel}
        </a>
        <button
          onClick={() => onDelete(channel.id)}
          className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

interface ChannelsDashboardProps {
  fetchChannels?: typeof _fetchChannels
  fetchChannelCatalog?: typeof _fetchChannelCatalog
  createChannel?: typeof _createChannel
  deleteChannel?: typeof _deleteChannel
}

export function ChannelsDashboard({
  fetchChannels = _fetchChannels,
  fetchChannelCatalog = _fetchChannelCatalog,
  createChannel = _createChannel,
  deleteChannel = _deleteChannel,
}: ChannelsDashboardProps = {}) {
  const router = useRouter()
  const [channels, setChannels] = useState<WorkspaceChannel[]>([])
  const [catalog, setCatalog] = useState<ChannelCatalogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [chs, cat] = await Promise.all([fetchChannels(), fetchChannelCatalog()])
      setChannels(chs)
      setCatalog(cat)
    } catch {
      setError('Failed to load channels')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreated = (channel: WorkspaceChannel) => {
    if (channel.channelType === 'website') {
      setShowCreate(false)
      router.push(getChannelSetupHref(channel))
      return
    }

    setChannels((prev) => [channel, ...prev])
    setShowCreate(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteChannel(id)
      setChannels((prev) => prev.filter((c) => c.id !== id))
      toast({ title: 'Channel deleted' })
    } catch {
      toast({ title: 'Failed to delete channel', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Channels</h1>
            <p className="text-sm text-muted-foreground">
              Connect your agents to external platforms
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Connect Channel
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Radio className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">No channels connected yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect a channel to start routing conversations to your agents.
          </p>
          <Button onClick={() => setShowCreate(true)} className="mt-4 gap-1.5">
            <Plus className="h-4 w-4" />
            Connect Channel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => (
            <ChannelCard
              key={ch.id}
              channel={ch}
              href={getChannelSetupHref(ch)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && catalog.length > 0 && (
        <CreateChannelModal
          catalog={catalog}
          onCreated={handleCreated}
          onClose={() => setShowCreate(false)}
          createChannel={createChannel}
        />
      )}
    </div>
  )
}

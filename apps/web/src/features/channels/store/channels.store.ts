import { create } from 'zustand'
import type {
  WorkspaceChannel,
  ChannelCatalogItem,
  CreateChannelPayload,
  UpdateChannelPayload,
} from '../types'
import {
  fetchChannels,
  fetchChannelCatalog,
  createChannel,
  updateChannel,
  deleteChannel,
} from '../api/channels.api'
import { toast } from '@/hooks/use-toast'

interface ChannelsState {
  channels: WorkspaceChannel[]
  catalog: ChannelCatalogItem[]
  isLoading: boolean
  error: string | null

  // Actions
  loadChannels: () => Promise<void>
  loadCatalog: () => Promise<void>
  loadAll: () => Promise<void>
  addChannel: (payload: CreateChannelPayload) => Promise<WorkspaceChannel>
  updateChannel: (id: string, payload: UpdateChannelPayload) => Promise<void>
  removeChannel: (id: string) => Promise<void>
  setError: (msg: string | null) => void
}

export const useChannelsStore = create<ChannelsState>((set, get) => ({
  channels: [],
  catalog: [],
  isLoading: false,
  error: null,

  loadChannels: async () => {
    set({ isLoading: true, error: null })
    try {
      const channels = await fetchChannels()
      set({ channels })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load channels' })
    } finally {
      set({ isLoading: false })
    }
  },

  loadCatalog: async () => {
    try {
      const catalog = await fetchChannelCatalog()
      set({ catalog })
    } catch {
      // Catalog is non-critical; fail silently
    }
  },

  loadAll: async () => {
    await Promise.all([get().loadChannels(), get().loadCatalog()])
  },

  addChannel: async (payload) => {
    const channel = await createChannel(payload)
    set((s) => ({ channels: [...s.channels, channel] }))
    return channel
  },

  updateChannel: async (id, payload) => {
    const updated = await updateChannel(id, payload)
    set((s) => ({
      channels: s.channels.map((c) => (c.id === id ? updated : c)),
    }))
  },

  removeChannel: async (id) => {
    await deleteChannel(id)
    set((s) => ({ channels: s.channels.filter((c) => c.id !== id) }))
    toast({ title: 'Channel removed' })
  },

  setError: (msg) => set({ error: msg }),
}))

import { create } from 'zustand'
import type {
  DraftAgent,
  BuilderSection,
  TestMessage,
  AgentTemplate,
  Agent,
  GuidanceRule,
  TemplateBehaviour,
  AgentStatus,
} from '../types'
import {
  fetchAgent,
  updateAgent,
  publishAgent as apiPublishAgent,
  pauseAgent as apiPauseAgent,
  resumeAgent as apiResumeAgent,
} from '../api/agents.api'

const DEFAULT_BEHAVIOUR: TemplateBehaviour = {
  systemPrompt: '',
  responseStyle: 50,
  fallback: 'handoff',
  tonePreset: 'neutral',
  customToneInstructions: '',
  useEmojis: true,
  showSourceLinks: true,
  guidanceRules: [],
}

const DEFAULT_DRAFT: DraftAgent = {
  templateId: null,
  identity: {
    name: '',
    welcomeMessage: '',
    tone: 'professional',
    language: 'en-US',
  },
  behaviour: DEFAULT_BEHAVIOUR,
  actions: [],
  knowledge: [],
  channels: [],
}

interface AgentBuilderState {
  agentId: string | null
  agentStatus: AgentStatus | null
  draftAgent: DraftAgent
  activeSection: BuilderSection
  completedSections: BuilderSection[]
  testMessages: TestMessage[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
  setAgentId: (id: string | null) => void
  hydrateFromAgent: (agent: Agent) => void
  applyTemplate: (template: AgentTemplate) => void
  setActiveSection: (section: BuilderSection) => void
  markSectionCompleted: (section: BuilderSection) => void
  updateIdentity: (identity: Partial<DraftAgent['identity']>) => void
  updateBehaviour: (behaviour: Partial<DraftAgent['behaviour']>) => void
  addGuidanceRule: (rule: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuidanceRule: (ruleId: string, patch: Partial<GuidanceRule>) => void
  removeGuidanceRule: (ruleId: string) => void
  toggleGuidanceRule: (ruleId: string) => void
  toggleAction: (action: string) => void
  toggleKnowledge: (source: string) => void
  toggleChannel: (channel: string) => void
  addTestMessage: (message: Omit<TestMessage, 'id' | 'timestamp'>) => void
  appendToLastTestMessage: (chunk: string) => void
  clearTestMessages: () => void
  resetDraft: () => void
  loadAgent: (id: string) => Promise<void>
  saveDraft: () => Promise<void>
  publishAgent: () => Promise<void>
  pauseAgent: () => Promise<void>
  resumeAgent: () => Promise<void>
}

let _saveTimeout: ReturnType<typeof setTimeout> | null = null

export const useAgentBuilderStore = create<AgentBuilderState>((set, get) => ({
  agentId: null,
  agentStatus: null,
  draftAgent: DEFAULT_DRAFT,
  activeSection: 'identity',
  completedSections: [],
  testMessages: [],
  isLoading: false,
  isSaving: false,
  error: null,

  setAgentId: (id) => set(id === null ? { agentId: null, agentStatus: null } : { agentId: id }),

  hydrateFromAgent: (agent: Agent) => {
    set({
      agentId: agent.id,
      agentStatus: agent.status,
      draftAgent: {
        ...DEFAULT_DRAFT,
        identity: {
          ...DEFAULT_DRAFT.identity,
          name: agent.name,
        },
        channels: agent.channels.map((ch) => ch.toLowerCase()),
      },
      completedSections: [],
      testMessages: [],
    })
  },

  applyTemplate: (template: AgentTemplate) => {
    set({
      draftAgent: {
        templateId: template.id,
        identity: { ...template.identity },
        behaviour: {
          ...DEFAULT_BEHAVIOUR,
          ...template.behaviour,
          guidanceRules: template.behaviour.guidanceRules
            ? [...template.behaviour.guidanceRules]
            : [],
        },
        actions: [...template.actions],
        knowledge: [...template.knowledge],
        channels: [...template.channels],
      },
    })
  },

  setActiveSection: (section: BuilderSection) => {
    set({ activeSection: section })
  },

  markSectionCompleted: (section: BuilderSection) => {
    set((state) => ({
      completedSections: state.completedSections.includes(section)
        ? state.completedSections
        : [...state.completedSections, section],
    }))
  },

  updateIdentity: (identity) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        identity: { ...state.draftAgent.identity, ...identity },
      },
    }))
    if (get().agentId) {
      if (_saveTimeout) clearTimeout(_saveTimeout)
      _saveTimeout = setTimeout(() => void get().saveDraft(), 500)
    }
  },

  updateBehaviour: (behaviour) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: { ...state.draftAgent.behaviour, ...behaviour },
      },
    }))
    if (get().agentId) {
      if (_saveTimeout) clearTimeout(_saveTimeout)
      _saveTimeout = setTimeout(() => void get().saveDraft(), 500)
    }
  },

  addGuidanceRule: (rule) => {
    const now = new Date().toISOString()
    const newRule: GuidanceRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: {
          ...state.draftAgent.behaviour,
          guidanceRules: [...state.draftAgent.behaviour.guidanceRules, newRule],
        },
      },
    }))
  },

  updateGuidanceRule: (ruleId, patch) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: {
          ...state.draftAgent.behaviour,
          guidanceRules: state.draftAgent.behaviour.guidanceRules.map((r) =>
            r.id === ruleId ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
          ),
        },
      },
    }))
  },

  removeGuidanceRule: (ruleId) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: {
          ...state.draftAgent.behaviour,
          guidanceRules: state.draftAgent.behaviour.guidanceRules.filter((r) => r.id !== ruleId),
        },
      },
    }))
  },

  toggleGuidanceRule: (ruleId) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: {
          ...state.draftAgent.behaviour,
          guidanceRules: state.draftAgent.behaviour.guidanceRules.map((r) =>
            r.id === ruleId ? { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() } : r
          ),
        },
      },
    }))
  },

  toggleAction: (action: string) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        actions: state.draftAgent.actions.includes(action)
          ? state.draftAgent.actions.filter((a) => a !== action)
          : [...state.draftAgent.actions, action],
      },
    }))
  },

  toggleKnowledge: (source: string) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        knowledge: state.draftAgent.knowledge.includes(source)
          ? state.draftAgent.knowledge.filter((k) => k !== source)
          : [...state.draftAgent.knowledge, source],
      },
    }))
  },

  toggleChannel: (channel: string) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        channels: state.draftAgent.channels.includes(channel)
          ? state.draftAgent.channels.filter((c) => c !== channel)
          : [...state.draftAgent.channels, channel],
      },
    }))
  },

  addTestMessage: (message) => {
    set((state) => ({
      testMessages: [
        ...state.testMessages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    }))
  },

  appendToLastTestMessage: (chunk) => {
    set((state) => {
      const msgs = state.testMessages
      const last = msgs[msgs.length - 1]
      if (!last || last.role !== 'assistant') return state
      const updated: TestMessage = { ...last, content: last.content + chunk }
      return { testMessages: [...msgs.slice(0, -1), updated] }
    })
  },

  clearTestMessages: () => {
    set({ testMessages: [] })
  },

  resetDraft: () => {
    if (_saveTimeout) {
      clearTimeout(_saveTimeout)
      _saveTimeout = null
    }
    set({
      agentId: null,
      agentStatus: null,
      draftAgent: DEFAULT_DRAFT,
      activeSection: 'identity',
      completedSections: [],
      testMessages: [],
      isLoading: false,
      isSaving: false,
      error: null,
    })
  },

  loadAgent: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const agent = await fetchAgent(id)
      if (!agent) {
        set({ isLoading: false, error: 'Agent not found' })
        return
      }
      get().hydrateFromAgent(agent)
      set({ isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed to load agent' })
    }
  },

  saveDraft: async () => {
    const { agentId, draftAgent } = get()
    if (!agentId) return
    set({ isSaving: true })
    try {
      await updateAgent(agentId, {
        name: draftAgent.identity.name,
        uiConfig: { channels: draftAgent.channels },
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to save draft' })
    } finally {
      set({ isSaving: false })
    }
  },

  publishAgent: async () => {
    const { agentId } = get()
    if (!agentId) return
    set({ isSaving: true, error: null })
    try {
      const agent = await apiPublishAgent(agentId)
      set({ agentStatus: agent.status })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish agent'
      set({ error: message })
      throw err
    } finally {
      set({ isSaving: false })
    }
  },

  pauseAgent: async () => {
    const { agentId } = get()
    if (!agentId) return
    set({ isSaving: true, error: null })
    try {
      const agent = await apiPauseAgent(agentId)
      set({ agentStatus: agent.status })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to pause agent'
      set({ error: message })
      throw err
    } finally {
      set({ isSaving: false })
    }
  },

  resumeAgent: async () => {
    const { agentId } = get()
    if (!agentId) return
    set({ isSaving: true, error: null })
    try {
      const agent = await apiResumeAgent(agentId)
      set({ agentStatus: agent.status })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resume agent'
      set({ error: message })
      throw err
    } finally {
      set({ isSaving: false })
    }
  },
}))

import { create } from 'zustand'
import type { DraftAgent, BuilderSection, TestMessage, AgentTemplate, Agent } from '../types'

const DEFAULT_DRAFT: DraftAgent = {
  templateId: null,
  identity: {
    name: '',
    welcomeMessage: '',
    tone: 'professional',
    language: 'en-US',
  },
  behaviour: {
    systemPrompt: '',
    responseStyle: 50,
    fallback: 'handoff',
  },
  actions: [],
  knowledge: [],
  channels: [],
}

interface AgentBuilderState {
  agentId: string | null
  draftAgent: DraftAgent
  activeSection: BuilderSection
  completedSections: BuilderSection[]
  testMessages: TestMessage[]
  setAgentId: (id: string | null) => void
  hydrateFromAgent: (agent: Agent) => void
  applyTemplate: (template: AgentTemplate) => void
  setActiveSection: (section: BuilderSection) => void
  markSectionCompleted: (section: BuilderSection) => void
  updateIdentity: (identity: Partial<DraftAgent['identity']>) => void
  updateBehaviour: (behaviour: Partial<DraftAgent['behaviour']>) => void
  toggleAction: (action: string) => void
  toggleKnowledge: (source: string) => void
  toggleChannel: (channel: string) => void
  addTestMessage: (message: Omit<TestMessage, 'id' | 'timestamp'>) => void
  clearTestMessages: () => void
  resetDraft: () => void
}

export const useAgentBuilderStore = create<AgentBuilderState>((set) => ({
  agentId: null,
  draftAgent: DEFAULT_DRAFT,
  activeSection: 'identity',
  completedSections: [],
  testMessages: [],

  setAgentId: (id) => set({ agentId: id }),

  hydrateFromAgent: (agent: Agent) => {
    set({
      agentId: agent.id,
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
        behaviour: { ...template.behaviour },
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
  },

  updateBehaviour: (behaviour) => {
    set((state) => ({
      draftAgent: {
        ...state.draftAgent,
        behaviour: { ...state.draftAgent.behaviour, ...behaviour },
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
          id: String(Date.now()),
          timestamp: new Date(),
        },
      ],
    }))
  },

  clearTestMessages: () => {
    set({ testMessages: [] })
  },

  resetDraft: () => {
    set({
      agentId: null,
      draftAgent: DEFAULT_DRAFT,
      activeSection: 'identity',
      completedSections: [],
      testMessages: [],
    })
  },
}))

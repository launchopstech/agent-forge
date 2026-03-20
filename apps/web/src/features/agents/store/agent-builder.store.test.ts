import { describe, it, expect, beforeEach } from 'vitest'
import { useAgentBuilderStore } from './agent-builder.store'
import type { AgentTemplate, Agent } from '../types'

const MOCK_TEMPLATE: AgentTemplate = {
  id: 'customer-support',
  name: 'Customer Support',
  emoji: '💬',
  category: 'support',
  description: 'FAQ, order tracking, and escalation',
  identity: { name: 'Support Bot', welcomeMessage: 'Hi!', tone: 'professional', language: 'en-US' },
  behaviour: { systemPrompt: 'You are a support bot.', responseStyle: 30, fallback: 'handoff' },
  actions: ['Process Refund', 'Create Ticket'],
  knowledge: ['FAQ Database'],
  channels: ['web'],
}

const MOCK_AGENT: Agent = {
  id: '42',
  name: 'Existing Bot',
  channels: ['Web', 'WhatsApp'],
  conversations: 500,
  resolution: 80,
  csat: 4.5,
  status: 'live',
}

beforeEach(() => {
  useAgentBuilderStore.getState().resetDraft()
})

describe('agent-builder.store', () => {
  describe('initial state', () => {
    it('starts with a blank draft', () => {
      const { draftAgent } = useAgentBuilderStore.getState()
      expect(draftAgent.identity.name).toBe('')
      expect(draftAgent.actions).toEqual([])
      expect(draftAgent.channels).toEqual([])
    })

    it('starts on the identity section', () => {
      expect(useAgentBuilderStore.getState().activeSection).toBe('identity')
    })

    it('starts with no completed sections', () => {
      expect(useAgentBuilderStore.getState().completedSections).toEqual([])
    })
  })

  describe('setAgentId', () => {
    it('stores the agent id', () => {
      useAgentBuilderStore.getState().setAgentId('99')
      expect(useAgentBuilderStore.getState().agentId).toBe('99')
    })

    it('accepts null for new agents', () => {
      useAgentBuilderStore.getState().setAgentId(null)
      expect(useAgentBuilderStore.getState().agentId).toBeNull()
    })
  })

  describe('hydrateFromAgent', () => {
    it('sets agentId and name from existing agent', () => {
      useAgentBuilderStore.getState().hydrateFromAgent(MOCK_AGENT)
      const state = useAgentBuilderStore.getState()
      expect(state.agentId).toBe('42')
      expect(state.draftAgent.identity.name).toBe('Existing Bot')
    })

    it('maps channels to lowercase', () => {
      useAgentBuilderStore.getState().hydrateFromAgent(MOCK_AGENT)
      expect(useAgentBuilderStore.getState().draftAgent.channels).toEqual(['web', 'whatsapp'])
    })

    it('resets completedSections and testMessages', () => {
      const store = useAgentBuilderStore.getState()
      store.markSectionCompleted('identity')
      store.addTestMessage({ role: 'user', content: 'hello' })
      store.hydrateFromAgent(MOCK_AGENT)
      const state = useAgentBuilderStore.getState()
      expect(state.completedSections).toEqual([])
      expect(state.testMessages).toEqual([])
    })
  })

  describe('applyTemplate', () => {
    it('populates all draft fields from template', () => {
      useAgentBuilderStore.getState().applyTemplate(MOCK_TEMPLATE)
      const { draftAgent } = useAgentBuilderStore.getState()
      expect(draftAgent.templateId).toBe('customer-support')
      expect(draftAgent.identity.name).toBe('Support Bot')
      expect(draftAgent.behaviour.systemPrompt).toBe('You are a support bot.')
      expect(draftAgent.actions).toEqual(['Process Refund', 'Create Ticket'])
      expect(draftAgent.knowledge).toEqual(['FAQ Database'])
      expect(draftAgent.channels).toEqual(['web'])
    })

    it('creates copies, not references', () => {
      useAgentBuilderStore.getState().applyTemplate(MOCK_TEMPLATE)
      const { draftAgent } = useAgentBuilderStore.getState()
      draftAgent.actions.push('Extra')
      expect(MOCK_TEMPLATE.actions).not.toContain('Extra')
    })
  })

  describe('setActiveSection', () => {
    it('changes the active section', () => {
      useAgentBuilderStore.getState().setActiveSection('behaviour')
      expect(useAgentBuilderStore.getState().activeSection).toBe('behaviour')
    })
  })

  describe('markSectionCompleted', () => {
    it('adds section to completedSections', () => {
      useAgentBuilderStore.getState().markSectionCompleted('identity')
      expect(useAgentBuilderStore.getState().completedSections).toContain('identity')
    })

    it('is idempotent — does not duplicate', () => {
      const store = useAgentBuilderStore.getState()
      store.markSectionCompleted('identity')
      store.markSectionCompleted('identity')
      const { completedSections } = useAgentBuilderStore.getState()
      expect(completedSections.filter((s) => s === 'identity')).toHaveLength(1)
    })
  })

  describe('updateIdentity', () => {
    it('merges partial identity updates', () => {
      useAgentBuilderStore.getState().updateIdentity({ name: 'My Bot' })
      const { identity } = useAgentBuilderStore.getState().draftAgent
      expect(identity.name).toBe('My Bot')
      expect(identity.tone).toBe('professional') // default preserved
    })
  })

  describe('updateBehaviour', () => {
    it('merges partial behaviour updates', () => {
      useAgentBuilderStore.getState().updateBehaviour({ responseStyle: 80, fallback: 'ticket' })
      const { behaviour } = useAgentBuilderStore.getState().draftAgent
      expect(behaviour.responseStyle).toBe(80)
      expect(behaviour.fallback).toBe('ticket')
      expect(behaviour.systemPrompt).toBe('') // default preserved
    })
  })

  describe('toggleAction', () => {
    it('adds an action when not present', () => {
      useAgentBuilderStore.getState().toggleAction('Process Refund')
      expect(useAgentBuilderStore.getState().draftAgent.actions).toContain('Process Refund')
    })

    it('removes an action when already present', () => {
      const store = useAgentBuilderStore.getState()
      store.toggleAction('Process Refund')
      store.toggleAction('Process Refund')
      expect(useAgentBuilderStore.getState().draftAgent.actions).not.toContain('Process Refund')
    })

    it('keeps other actions intact when removing one', () => {
      const store = useAgentBuilderStore.getState()
      store.toggleAction('Create Ticket')
      store.toggleAction('Process Refund')
      store.toggleAction('Create Ticket')
      expect(useAgentBuilderStore.getState().draftAgent.actions).toContain('Process Refund')
    })
  })

  describe('toggleKnowledge', () => {
    it('adds a knowledge source when not present', () => {
      useAgentBuilderStore.getState().toggleKnowledge('FAQ Database')
      expect(useAgentBuilderStore.getState().draftAgent.knowledge).toContain('FAQ Database')
    })

    it('removes a knowledge source when already present', () => {
      const store = useAgentBuilderStore.getState()
      store.toggleKnowledge('FAQ Database')
      store.toggleKnowledge('FAQ Database')
      expect(useAgentBuilderStore.getState().draftAgent.knowledge).not.toContain('FAQ Database')
    })
  })

  describe('toggleChannel', () => {
    it('adds a channel when not present', () => {
      useAgentBuilderStore.getState().toggleChannel('web')
      expect(useAgentBuilderStore.getState().draftAgent.channels).toContain('web')
    })

    it('removes a channel when already present', () => {
      const store = useAgentBuilderStore.getState()
      store.toggleChannel('web')
      store.toggleChannel('web')
      expect(useAgentBuilderStore.getState().draftAgent.channels).not.toContain('web')
    })
  })

  describe('addTestMessage', () => {
    it('appends a message with id and timestamp', () => {
      useAgentBuilderStore.getState().addTestMessage({ role: 'user', content: 'Hello' })
      const { testMessages } = useAgentBuilderStore.getState()
      expect(testMessages).toHaveLength(1)
      const [msg] = testMessages
      expect(msg?.role).toBe('user')
      expect(msg?.content).toBe('Hello')
      expect(msg?.id).toBeDefined()
      expect(msg?.timestamp).toBeInstanceOf(Date)
    })

    it('appends multiple messages in order', () => {
      const store = useAgentBuilderStore.getState()
      store.addTestMessage({ role: 'user', content: 'Q' })
      store.addTestMessage({ role: 'assistant', content: 'A' })
      const { testMessages } = useAgentBuilderStore.getState()
      expect(testMessages).toHaveLength(2)
      const [first, second] = testMessages
      expect(first?.role).toBe('user')
      expect(second?.role).toBe('assistant')
    })
  })

  describe('clearTestMessages', () => {
    it('empties the messages array', () => {
      const store = useAgentBuilderStore.getState()
      store.addTestMessage({ role: 'user', content: 'Hi' })
      store.clearTestMessages()
      expect(useAgentBuilderStore.getState().testMessages).toEqual([])
    })
  })

  describe('resetDraft', () => {
    it('resets everything to initial state', () => {
      const store = useAgentBuilderStore.getState()
      store.setAgentId('7')
      store.updateIdentity({ name: 'Modified' })
      store.markSectionCompleted('identity')
      store.addTestMessage({ role: 'user', content: 'test' })
      store.resetDraft()
      const state = useAgentBuilderStore.getState()
      expect(state.agentId).toBeNull()
      expect(state.draftAgent.identity.name).toBe('')
      expect(state.completedSections).toEqual([])
      expect(state.testMessages).toEqual([])
      expect(state.activeSection).toBe('identity')
    })
  })
})

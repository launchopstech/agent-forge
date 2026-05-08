import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAgentBuilderStore } from './agent-builder.store'
import type { AgentTemplate, Agent } from '../types'

vi.mock('../api/agents.api', () => ({
  fetchAgent: vi.fn(),
  updateAgent: vi.fn(),
  publishAgent: vi.fn(),
}))

import { fetchAgent, updateAgent, publishAgent as apiPublishAgent } from '../api/agents.api'

const MOCK_TEMPLATE: AgentTemplate = {
  id: 'customer-support',
  name: 'Customer Support',
  emoji: '💬',
  category: 'support',
  description: 'FAQ, order tracking, and escalation',
  identity: { name: 'Support Bot', welcomeMessage: 'Hi!', tone: 'professional', language: 'en-US' },
  behaviour: {
    systemPrompt: 'You are a support bot.',
    responseStyle: 30,
    fallback: 'handoff',
    tonePreset: 'friendly',
    customToneInstructions: '',
    useEmojis: true,
    showSourceLinks: true,
    guidanceRules: [
      {
        id: 'rule-1',
        name: 'Refund Handling',
        category: 'escalation',
        whenCondition: 'Customer requests a refund',
        instructions: 'Escalate to supervisor',
        enabled: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ],
  },
  actions: ['Process Refund', 'Create Ticket'],
  knowledge: ['FAQ Database'],
  channels: ['web'],
}

const MOCK_TEMPLATE_LEGACY: AgentTemplate = {
  id: 'legacy',
  name: 'Legacy',
  emoji: '📦',
  category: 'support',
  description: 'Legacy template without new behaviour fields',
  identity: { name: 'Legacy Bot', welcomeMessage: 'Hi!', tone: 'professional', language: 'en-US' },
  behaviour: {
    systemPrompt: 'Legacy prompt.',
    responseStyle: 50,
    fallback: 'handoff',
  } as AgentTemplate['behaviour'],
  actions: [],
  knowledge: [],
  channels: [],
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
  vi.clearAllMocks()
  useAgentBuilderStore.getState().resetDraft()
})

describe('agent-builder.store', () => {
  describe('initial state', () => {
    it('starts with a blank draft', () => {
      const { draftAgent } = useAgentBuilderStore.getState()
      expect(draftAgent.identity.name).toBe('')
      expect(draftAgent.behaviour.tonePreset).toBe('neutral')
      expect(draftAgent.behaviour.useEmojis).toBe(true)
      expect(draftAgent.behaviour.showSourceLinks).toBe(true)
      expect(draftAgent.behaviour.guidanceRules).toEqual([])
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
      expect(draftAgent.behaviour.tonePreset).toBe('friendly')
      expect(draftAgent.behaviour.useEmojis).toBe(true)
      expect(draftAgent.behaviour.guidanceRules).toHaveLength(1)
      expect(draftAgent.behaviour.guidanceRules[0]?.name).toBe('Refund Handling')
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

    it('applies defaults for legacy templates missing new fields', () => {
      useAgentBuilderStore.getState().applyTemplate(MOCK_TEMPLATE_LEGACY)
      const { behaviour } = useAgentBuilderStore.getState().draftAgent
      expect(behaviour.systemPrompt).toBe('Legacy prompt.')
      expect(behaviour.tonePreset).toBe('neutral')
      expect(behaviour.useEmojis).toBe(true)
      expect(behaviour.showSourceLinks).toBe(true)
      expect(behaviour.guidanceRules).toEqual([])
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

    it('merges new behaviour fields', () => {
      useAgentBuilderStore.getState().updateBehaviour({ tonePreset: 'friendly', useEmojis: false })
      const { behaviour } = useAgentBuilderStore.getState().draftAgent
      expect(behaviour.tonePreset).toBe('friendly')
      expect(behaviour.useEmojis).toBe(false)
      expect(behaviour.showSourceLinks).toBe(true) // default preserved
    })
  })

  describe('addGuidanceRule', () => {
    it('adds a rule with generated id and timestamps', () => {
      useAgentBuilderStore.getState().addGuidanceRule({
        name: 'Test',
        category: 'communication',
        whenCondition: 'When asked',
        instructions: 'Do this',
        enabled: true,
      })
      const { guidanceRules } = useAgentBuilderStore.getState().draftAgent.behaviour
      expect(guidanceRules).toHaveLength(1)
      expect(guidanceRules[0]?.id).toBeDefined()
      expect(guidanceRules[0]?.name).toBe('Test')
      expect(guidanceRules[0]?.createdAt).toBeDefined()
      expect(guidanceRules[0]?.updatedAt).toBeDefined()
    })

    it('appends multiple rules', () => {
      const store = useAgentBuilderStore.getState()
      store.addGuidanceRule({
        name: 'R1',
        category: 'communication',
        whenCondition: 'c1',
        instructions: 'i1',
        enabled: true,
      })
      store.addGuidanceRule({
        name: 'R2',
        category: 'escalation',
        whenCondition: 'c2',
        instructions: 'i2',
        enabled: true,
      })
      expect(useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules).toHaveLength(2)
    })
  })

  describe('updateGuidanceRule', () => {
    it('merges patch into the matching rule', () => {
      useAgentBuilderStore.getState().addGuidanceRule({
        name: 'Original',
        category: 'communication',
        whenCondition: 'c',
        instructions: 'i',
        enabled: true,
      })
      const ruleId = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!.id
      useAgentBuilderStore.getState().updateGuidanceRule(ruleId, { name: 'Updated' })
      const rule = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!
      expect(rule.name).toBe('Updated')
      expect(rule.category).toBe('communication') // preserved
    })

    it('updates the updatedAt timestamp', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))
      useAgentBuilderStore.getState().addGuidanceRule({
        name: 'R',
        category: 'other',
        whenCondition: 'c',
        instructions: 'i',
        enabled: true,
      })
      const original = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!
      vi.setSystemTime(new Date('2025-01-01T00:01:00.000Z'))
      useAgentBuilderStore.getState().updateGuidanceRule(original.id, { name: 'New' })
      const updated = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!
      expect(updated.updatedAt).not.toBe(original.updatedAt)
      vi.useRealTimers()
    })
  })

  describe('removeGuidanceRule', () => {
    it('removes the rule by id', () => {
      useAgentBuilderStore.getState().addGuidanceRule({
        name: 'ToDelete',
        category: 'communication',
        whenCondition: 'c',
        instructions: 'i',
        enabled: true,
      })
      const ruleId = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!.id
      useAgentBuilderStore.getState().removeGuidanceRule(ruleId)
      expect(useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules).toHaveLength(0)
    })
  })

  describe('toggleGuidanceRule', () => {
    it('flips the enabled flag', () => {
      useAgentBuilderStore.getState().addGuidanceRule({
        name: 'Toggle',
        category: 'escalation',
        whenCondition: 'c',
        instructions: 'i',
        enabled: true,
      })
      const ruleId = useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!.id
      useAgentBuilderStore.getState().toggleGuidanceRule(ruleId)
      expect(useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!.enabled).toBe(
        false
      )
      useAgentBuilderStore.getState().toggleGuidanceRule(ruleId)
      expect(useAgentBuilderStore.getState().draftAgent.behaviour.guidanceRules[0]!.enabled).toBe(
        true
      )
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
      store.updateBehaviour({ tonePreset: 'formal' })
      store.addGuidanceRule({
        name: 'R',
        category: 'communication',
        whenCondition: 'c',
        instructions: 'i',
        enabled: true,
      })
      store.markSectionCompleted('identity')
      store.addTestMessage({ role: 'user', content: 'test' })
      store.resetDraft()
      const state = useAgentBuilderStore.getState()
      expect(state.agentId).toBeNull()
      expect(state.draftAgent.identity.name).toBe('')
      expect(state.draftAgent.behaviour.tonePreset).toBe('neutral')
      expect(state.draftAgent.behaviour.guidanceRules).toEqual([])
      expect(state.completedSections).toEqual([])
      expect(state.testMessages).toEqual([])
      expect(state.activeSection).toBe('identity')
    })

    it('clears isLoading, isSaving, and error', () => {
      useAgentBuilderStore.setState({ isLoading: true, isSaving: true, error: 'some error' })
      useAgentBuilderStore.getState().resetDraft()
      const state = useAgentBuilderStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.isSaving).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('loadAgent', () => {
    it('calls fetchAgent with the given id', async () => {
      vi.mocked(fetchAgent).mockResolvedValue(MOCK_AGENT)
      await useAgentBuilderStore.getState().loadAgent('42')
      expect(fetchAgent).toHaveBeenCalledWith('42')
    })

    it('hydrates the store from the fetched agent', async () => {
      vi.mocked(fetchAgent).mockResolvedValue(MOCK_AGENT)
      await useAgentBuilderStore.getState().loadAgent('42')
      const state = useAgentBuilderStore.getState()
      expect(state.agentId).toBe('42')
      expect(state.draftAgent.identity.name).toBe('Existing Bot')
    })

    it('sets isLoading during the call', async () => {
      let loadingDuring = false
      vi.mocked(fetchAgent).mockImplementation(async () => {
        loadingDuring = useAgentBuilderStore.getState().isLoading
        return MOCK_AGENT
      })
      await useAgentBuilderStore.getState().loadAgent('42')
      expect(loadingDuring).toBe(true)
      expect(useAgentBuilderStore.getState().isLoading).toBe(false)
    })

    it('sets error when agent is not found (null)', async () => {
      vi.mocked(fetchAgent).mockResolvedValue(null)
      await useAgentBuilderStore.getState().loadAgent('nonexistent')
      const state = useAgentBuilderStore.getState()
      expect(state.error).toBe('Agent not found')
      expect(state.isLoading).toBe(false)
    })

    it('sets error on unexpected failure', async () => {
      vi.mocked(fetchAgent).mockRejectedValue(new Error('Network error'))
      await useAgentBuilderStore.getState().loadAgent('42')
      expect(useAgentBuilderStore.getState().error).toBe('Network error')
    })
  })

  describe('saveDraft', () => {
    it('calls updateAgent with agentId and draft fields', async () => {
      vi.mocked(updateAgent).mockResolvedValue(MOCK_AGENT)
      useAgentBuilderStore.setState({ agentId: '42' })
      useAgentBuilderStore.getState().updateIdentity({ name: 'My Bot' })
      await useAgentBuilderStore.getState().saveDraft()
      expect(updateAgent).toHaveBeenCalledWith('42', expect.objectContaining({ name: 'My Bot' }))
    })

    it('does nothing when agentId is null', async () => {
      useAgentBuilderStore.getState().resetDraft()
      await useAgentBuilderStore.getState().saveDraft()
      expect(updateAgent).not.toHaveBeenCalled()
    })

    it('clears isSaving after completion', async () => {
      vi.mocked(updateAgent).mockResolvedValue(MOCK_AGENT)
      useAgentBuilderStore.setState({ agentId: '42' })
      await useAgentBuilderStore.getState().saveDraft()
      expect(useAgentBuilderStore.getState().isSaving).toBe(false)
    })

    it('sets error on failure', async () => {
      vi.mocked(updateAgent).mockRejectedValue(new Error('Save failed'))
      useAgentBuilderStore.setState({ agentId: '42' })
      await useAgentBuilderStore.getState().saveDraft()
      expect(useAgentBuilderStore.getState().error).toBe('Save failed')
      expect(useAgentBuilderStore.getState().isSaving).toBe(false)
    })
  })

  describe('publishAgent', () => {
    it('calls apiPublishAgent with agentId', async () => {
      vi.mocked(apiPublishAgent).mockResolvedValue({ ...MOCK_AGENT, status: 'live' })
      useAgentBuilderStore.setState({ agentId: '42' })
      await useAgentBuilderStore.getState().publishAgent()
      expect(apiPublishAgent).toHaveBeenCalledWith('42')
    })

    it('does nothing when agentId is null', async () => {
      useAgentBuilderStore.getState().resetDraft()
      await useAgentBuilderStore.getState().publishAgent()
      expect(apiPublishAgent).not.toHaveBeenCalled()
    })

    it('sets error on failure', async () => {
      vi.mocked(apiPublishAgent).mockRejectedValue(new Error('Publish failed'))
      useAgentBuilderStore.setState({ agentId: '42' })
      await useAgentBuilderStore.getState().publishAgent()
      expect(useAgentBuilderStore.getState().error).toBe('Publish failed')
    })
  })

  describe('auto-save debounce', () => {
    it('schedules saveDraft 500ms after updateIdentity when agentId is set', async () => {
      vi.useFakeTimers()
      vi.mocked(updateAgent).mockResolvedValue(MOCK_AGENT)
      useAgentBuilderStore.setState({ agentId: '42' })

      useAgentBuilderStore.getState().updateIdentity({ name: 'Auto Save Bot' })
      expect(updateAgent).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(500)
      expect(updateAgent).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('debounces — only saves once for rapid consecutive updates', async () => {
      vi.useFakeTimers()
      vi.mocked(updateAgent).mockResolvedValue(MOCK_AGENT)
      useAgentBuilderStore.setState({ agentId: '42' })

      useAgentBuilderStore.getState().updateIdentity({ name: 'A' })
      useAgentBuilderStore.getState().updateIdentity({ name: 'AB' })
      useAgentBuilderStore.getState().updateIdentity({ name: 'ABC' })

      await vi.advanceTimersByTimeAsync(500)
      expect(updateAgent).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('does not schedule auto-save when agentId is null', async () => {
      vi.useFakeTimers()
      vi.mocked(updateAgent).mockResolvedValue(MOCK_AGENT)
      useAgentBuilderStore.getState().resetDraft() // agentId = null

      useAgentBuilderStore.getState().updateIdentity({ name: 'No Save' })
      await vi.advanceTimersByTimeAsync(500)
      expect(updateAgent).not.toHaveBeenCalled()

      vi.useRealTimers()
    })
  })
})

import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { KnowledgeSection } from './KnowledgeSection'
import { useAgentBuilderStore } from '../../store/agent-builder.store'
import type { KnowledgeSourceOption } from '../../types'

const apiMocks = vi.hoisted(() => ({
  fetchKnowledgeItems: vi.fn(),
  createKnowledgeItem: vi.fn(),
  updateKnowledgeItem: vi.fn(),
  deleteKnowledgeItem: vi.fn(),
  fetchKnowledgeSourceOptions: vi.fn(),
  fetchAgentKnowledgeSources: vi.fn(),
  updateAgentKnowledgeSources: vi.fn(),
}))

const agentApiMocks = vi.hoisted(() => ({
  createAgent: vi.fn(),
  fetchAgent: vi.fn(),
  updateAgent: vi.fn(),
  publishAgent: vi.fn(),
  pauseAgent: vi.fn(),
  resumeAgent: vi.fn(),
}))

const routerMocks = vi.hoisted(() => ({
  replace: vi.fn(),
}))

const listStoreMocks = vi.hoisted(() => ({
  refreshDashboardData: vi.fn(),
}))

vi.mock('../../api/knowledge.api', () => ({
  fetchKnowledgeItems: apiMocks.fetchKnowledgeItems,
  createKnowledgeItem: apiMocks.createKnowledgeItem,
  updateKnowledgeItem: apiMocks.updateKnowledgeItem,
  deleteKnowledgeItem: apiMocks.deleteKnowledgeItem,
  fetchKnowledgeSourceOptions: apiMocks.fetchKnowledgeSourceOptions,
  fetchAgentKnowledgeSources: apiMocks.fetchAgentKnowledgeSources,
  updateAgentKnowledgeSources: apiMocks.updateAgentKnowledgeSources,
}))

vi.mock('../../api/agents.api', () => ({
  createAgent: agentApiMocks.createAgent,
  fetchAgent: agentApiMocks.fetchAgent,
  updateAgent: agentApiMocks.updateAgent,
  publishAgent: agentApiMocks.publishAgent,
  pauseAgent: agentApiMocks.pauseAgent,
  resumeAgent: agentApiMocks.resumeAgent,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: routerMocks.replace,
  }),
}))

vi.mock('../../store/agent-list.store', () => ({
  useAgentListStore: {
    getState: () => ({
      refreshDashboardData: listStoreMocks.refreshDashboardData,
    }),
  },
}))

const labels: Record<string, string> = {
  title: 'Knowledge Base',
  subtitle: 'Add the business facts your agent should use in answers',
  saveFirst: 'Save your agent first to add knowledge.',
  loadError: 'Failed to load knowledge.',
  saveError: 'Failed to save knowledge.',
  retry: 'Retry',
  sourcesTitle: 'Knowledge sources',
  sourcesDescription: 'Choose the areas this agent should be prepared to answer from.',
  sourceEmpty: 'Select a knowledge source to configure it.',
  qaTitle: 'Q&A pairs',
  qaDescription: 'Add exact questions and answers the agent should know.',
  addQa: 'Add Q&A',
  qaEmpty: 'Add your first Q&A pair to teach the agent about your business',
  questionLabel: 'Question',
  questionPlaceholder: 'Question',
  answerLabel: 'Answer',
  answerPlaceholder: 'Answer',
  deleteQa: 'Delete Q&A',
  documentsTitle: 'Business info',
  documentsDescription: 'Paste policies, product details, or procedures.',
  addDocument: 'Add document',
  documentsEmpty: 'Paste your return policy, product details, or any other information',
  documentTitleLabel: 'Document title',
  documentTitlePlaceholder: 'Title',
  documentContentLabel: 'Document content',
  documentContentPlaceholder: 'Paste business information...',
  deleteDocument: 'Delete document',
  shopifyTitle: 'Shopify sync',
  shopifyDescription: 'Auto-import your products, policies and FAQs',
  connectShopify: 'Connect Shopify',
  comingSoon: 'Coming soon',
  selectedCount: '{count} sources selected',
}

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    (labels[key] ?? key).replace('{count}', String(values?.count ?? '')),
}))

vi.mock('@forge/ui/src/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const faqSource: KnowledgeSourceOption = {
  id: 'source-faq',
  slug: 'faq-database',
  name: 'FAQ Database',
  emoji: '❓',
  description: 'Frequently asked questions and answers',
  category: 'support',
  uiSchema: { setupMode: 'qa' },
  enabled: true,
  position: 0,
}

const returnsSource: KnowledgeSourceOption = {
  id: 'source-returns',
  slug: 'return-policy',
  name: 'Return Policy',
  emoji: '🔄',
  description: 'Returns and exchanges policy',
  category: 'ecommerce',
  uiSchema: { setupMode: 'document' },
  enabled: true,
  position: 1,
}

const catalogSource: KnowledgeSourceOption = {
  id: 'source-catalog',
  slug: 'product-catalog',
  name: 'Product Catalog',
  emoji: '🛍️',
  description: 'Product catalog information and inventory details',
  category: 'ecommerce',
  uiSchema: { setupMode: 'integration', integrationProvider: 'shopify' },
  enabled: true,
  position: 2,
}

const allSources = [faqSource, returnsSource, catalogSource]

const qaItem = {
  id: 'knowledge-qa',
  type: 'qa' as const,
  title: 'FAQ Database',
  question: 'What is your return policy?',
  answer: '30-day returns',
  content: null,
  sourceUrl: null,
  knowledgeSourceOptionId: faqSource.id,
  position: 0,
}

const documentItem = {
  id: 'knowledge-document',
  type: 'document' as const,
  title: 'Returns',
  question: null,
  answer: null,
  content: '30-day returns on all items.',
  sourceUrl: null,
  knowledgeSourceOptionId: returnsSource.id,
  position: 1,
}

beforeEach(() => {
  vi.clearAllMocks()
  useAgentBuilderStore.getState().resetDraft()
  agentApiMocks.createAgent.mockResolvedValue({
    id: 'auto-agent',
    name: 'Order Bot',
    agentType: 'support',
    channels: ['Web'],
    conversations: 0,
    resolution: null,
    csat: null,
    status: 'draft',
    shareToken: 'share-auto',
  })
  apiMocks.fetchKnowledgeSourceOptions.mockResolvedValue(allSources)
  apiMocks.fetchAgentKnowledgeSources.mockResolvedValue([faqSource])
  apiMocks.fetchKnowledgeItems.mockResolvedValue([])
  apiMocks.updateAgentKnowledgeSources.mockImplementation(async (_agentId, slugs: string[]) =>
    allSources.filter((source) => slugs.includes(source.slug))
  )
  apiMocks.createKnowledgeItem.mockImplementation(async (_agentId, payload) => ({
    id: 'created-knowledge',
    ...payload,
  }))
  apiMocks.updateKnowledgeItem.mockImplementation(async (_agentId, itemId, payload) => ({
    id: itemId,
    type: 'qa',
    title: null,
    question: null,
    answer: null,
    content: null,
    sourceUrl: null,
    knowledgeSourceOptionId: null,
    position: 0,
    ...payload,
  }))
  apiMocks.deleteKnowledgeItem.mockResolvedValue(undefined)
})

function renderSaved(selectedSources: KnowledgeSourceOption[] = [faqSource]) {
  apiMocks.fetchAgentKnowledgeSources.mockResolvedValue(selectedSources)
  useAgentBuilderStore.setState({ agentId: 'agent-1' })
  render(<KnowledgeSection />)
}

function renderUnsaved(selectedSlugs: string[] = [faqSource.slug]) {
  useAgentBuilderStore.setState((state) => ({
    draftAgent: {
      ...state.draftAgent,
      agentType: 'support',
      identity: { ...state.draftAgent.identity, name: 'Order Bot' },
      channels: ['web'],
      knowledge: selectedSlugs,
    },
  }))
  render(<KnowledgeSection />)
}

describe('KnowledgeSection', () => {
  it('shows selected setup panels for unsaved drafts', async () => {
    renderUnsaved()

    expect(await screen.findAllByText('FAQ Database')).not.toHaveLength(0)
    expect(screen.queryByText('Save your agent first to add knowledge.')).not.toBeInTheDocument()
    expect(
      screen.getByText('Add your first Q&A pair to teach the agent about your business')
    ).toBeInTheDocument()
    expect(apiMocks.fetchKnowledgeItems).not.toHaveBeenCalled()
  })

  it('auto-creates an unsaved draft before saving a Q&A pair', async () => {
    renderUnsaved()

    await userEvent.click(await screen.findByRole('button', { name: /add q&a/i }))

    fireEvent.change(screen.getByPlaceholderText('Question'), {
      target: { value: 'What is your return policy?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Answer'), {
      target: { value: '30-day returns' },
    })

    await waitFor(
      () =>
        expect(agentApiMocks.createAgent).toHaveBeenCalledWith({
          name: 'Order Bot',
          templateId: undefined,
          agentType: 'support',
          uiConfig: { channels: ['web'] },
          knowledgeSourceSlugs: ['faq-database'],
        }),
      { timeout: 1500 }
    )
    expect(apiMocks.createKnowledgeItem).toHaveBeenCalledWith(
      'auto-agent',
      expect.objectContaining({
        type: 'qa',
        question: 'What is your return policy?',
        answer: '30-day returns',
        knowledgeSourceOptionId: faqSource.id,
      })
    )
    expect(routerMocks.replace).toHaveBeenCalledWith('/agents/auto-agent/knowledge', {
      scroll: false,
    })
  })

  it('auto-creates an unsaved draft before saving a document', async () => {
    renderUnsaved([returnsSource.slug])

    await userEvent.click(await screen.findByRole('button', { name: /add document/i }))

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Returns' } })
    const content = screen.getByPlaceholderText('Paste business information...')
    fireEvent.change(content, { target: { value: '30-day returns on all items.' } })
    fireEvent.blur(content)

    await waitFor(() =>
      expect(apiMocks.createKnowledgeItem).toHaveBeenCalledWith(
        'auto-agent',
        expect.objectContaining({
          type: 'document',
          title: 'Returns',
          content: '30-day returns on all items.',
          knowledgeSourceOptionId: returnsSource.id,
        })
      )
    )
    expect(agentApiMocks.createAgent).toHaveBeenCalledWith(
      expect.objectContaining({ knowledgeSourceSlugs: ['return-policy'] })
    )
  })

  it('includes source selections made before auto-create', async () => {
    renderUnsaved([faqSource.slug])

    await userEvent.click(await screen.findByRole('switch', { name: 'Return Policy' }))
    await userEvent.click(screen.getByRole('button', { name: /add q&a/i }))

    fireEvent.change(screen.getByPlaceholderText('Question'), {
      target: { value: 'Do you ship internationally?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Answer'), {
      target: { value: 'Yes, to selected countries.' },
    })

    await waitFor(
      () =>
        expect(agentApiMocks.createAgent).toHaveBeenCalledWith(
          expect.objectContaining({
            knowledgeSourceSlugs: ['faq-database', 'return-policy'],
          })
        ),
      { timeout: 1500 }
    )
  })

  it('shows a save error and skips knowledge creation when auto-create fails', async () => {
    agentApiMocks.createAgent.mockRejectedValueOnce(new Error('Create failed'))
    renderUnsaved()

    await userEvent.click(await screen.findByRole('button', { name: /add q&a/i }))

    fireEvent.change(screen.getByPlaceholderText('Question'), {
      target: { value: 'What is your return policy?' },
    })
    fireEvent.change(screen.getByPlaceholderText('Answer'), {
      target: { value: '30-day returns' },
    })

    expect(await screen.findByText('Failed to save knowledge.')).toBeInTheDocument()
    expect(apiMocks.createKnowledgeItem).not.toHaveBeenCalled()
    expect(routerMocks.replace).not.toHaveBeenCalled()
  })

  it('shows load errors and retries fetching catalog data', async () => {
    apiMocks.fetchKnowledgeSourceOptions
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(allSources)
    apiMocks.fetchAgentKnowledgeSources.mockResolvedValue([faqSource])
    apiMocks.fetchKnowledgeItems.mockResolvedValue([qaItem])

    renderSaved()

    expect(await screen.findByText('Failed to load knowledge.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /retry/i }))

    expect(await screen.findByDisplayValue('What is your return policy?')).toBeInTheDocument()
    expect(apiMocks.fetchKnowledgeSourceOptions).toHaveBeenCalledTimes(2)
  })

  it('adds, debounced-saves, and deletes a Q&A pair under a selected source', async () => {
    renderSaved([faqSource])

    expect(
      await screen.findByText('Add your first Q&A pair to teach the agent about your business')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /add q&a/i }))

    const question = screen.getByPlaceholderText('Question')
    expect(question).toHaveFocus()

    fireEvent.change(question, { target: { value: 'What is your return policy?' } })
    fireEvent.change(screen.getByPlaceholderText('Answer'), {
      target: { value: '30-day returns' },
    })

    await waitFor(
      () =>
        expect(apiMocks.createKnowledgeItem).toHaveBeenCalledWith(
          'agent-1',
          expect.objectContaining({
            type: 'qa',
            question: 'What is your return policy?',
            answer: '30-day returns',
            knowledgeSourceOptionId: faqSource.id,
          })
        ),
      { timeout: 1500 }
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete Q&A' }))

    await waitFor(() =>
      expect(apiMocks.deleteKnowledgeItem).toHaveBeenCalledWith('agent-1', 'created-knowledge')
    )
  })

  it('adds, blur-saves, and deletes a document under a selected source', async () => {
    renderSaved([returnsSource])

    expect(
      await screen.findByText('Paste your return policy, product details, or any other information')
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /add document/i }))

    const title = screen.getByPlaceholderText('Title')
    const content = screen.getByPlaceholderText('Paste business information...')
    fireEvent.change(title, { target: { value: 'Returns' } })
    fireEvent.change(content, { target: { value: '30-day returns on all items.' } })
    fireEvent.blur(content)

    await waitFor(() =>
      expect(apiMocks.createKnowledgeItem).toHaveBeenCalledWith(
        'agent-1',
        expect.objectContaining({
          type: 'document',
          title: 'Returns',
          content: '30-day returns on all items.',
          knowledgeSourceOptionId: returnsSource.id,
        })
      )
    )

    await userEvent.click(screen.getByRole('button', { name: 'Delete document' }))

    await waitFor(() =>
      expect(apiMocks.deleteKnowledgeItem).toHaveBeenCalledWith('agent-1', 'created-knowledge')
    )
  })

  it('renders existing grouped items and a disabled integration control', async () => {
    apiMocks.fetchKnowledgeItems.mockResolvedValue([qaItem, documentItem])
    renderSaved([faqSource, returnsSource, catalogSource])

    expect(await screen.findByDisplayValue('What is your return policy?')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Returns')).toBeInTheDocument()
    expect(screen.getAllByText('Product Catalog')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Connect Shopify' })).toBeDisabled()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
  })
})

export type AgentStatus = 'live' | 'draft' | 'paused'

export type AgentChannel = 'Web' | 'WhatsApp' | 'Slack' | 'Email' | 'SMS'

export interface Agent {
  id: string
  name: string
  agentType: string
  channels: AgentChannel[]
  conversations: number
  resolution: number | null
  csat: number | null
  status: AgentStatus
  shareToken?: string | null
}

export interface TemplateIdentity {
  name: string
  welcomeMessage: string
  tone: 'professional' | 'friendly' | 'formal' | 'casual'
  language: string
}

export type TonePreset = 'neutral' | 'friendly' | 'formal' | 'custom'

export type GuidanceCategory = 'communication' | 'escalation' | 'other'

export interface GuidanceRule {
  id: string
  name: string
  category: GuidanceCategory
  whenCondition: string
  instructions: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateBehaviour {
  systemPrompt: string
  responseStyle: number // 0–100 (concise → detailed)
  fallback: 'handoff' | 'ticket' | 'email'
  tonePreset: TonePreset
  customToneInstructions: string
  useEmojis: boolean
  showSourceLinks: boolean
  guidanceRules: GuidanceRule[]
}

export interface AgentTemplate {
  id: string
  name: string
  emoji: string
  category: string
  agentType: string
  description: string
  identity: TemplateIdentity
  behaviour: TemplateBehaviour
  actions: string[]
  knowledge: string[]
  knowledgeSourceSlugs?: string[]
  knowledgeSources?: KnowledgeSourceOption[]
  channels: string[]
}

export interface AgentType {
  id: string
  slug: string
  name: string
  emoji: string
  description: string
  enabled: boolean
  position: number
}

export interface KnowledgeSourceUiSchema {
  setupMode?: 'qa' | 'document' | 'integration'
  integrationProvider?: string
  [key: string]: unknown
}

export interface KnowledgeSourceOption {
  id: string
  slug: string
  name: string
  emoji: string
  description: string
  category: string
  uiSchema: KnowledgeSourceUiSchema
  enabled: boolean
  position: number
}

export interface DashboardMetrics {
  totalAgents: number | null
  activeAgents: number | null
  totalMessages: number | null
  period: 'all-time'
}

export interface UnresolvedIntent {
  label: string
  percentage: number
  severity: 'high' | 'medium' | 'low'
}

export interface Recommendation {
  type: 'warning' | 'info' | 'success'
  message: string
  cta: string
  agentId: string
}

export interface MetricsData {
  metrics: DashboardMetrics
  unresolvedIntents: UnresolvedIntent[]
  recommendation: Recommendation
}

export type BuilderSection = 'identity' | 'behaviour' | 'actions' | 'knowledge' | 'channels'

export interface DraftAgent {
  templateId: string | null
  agentType: string
  identity: TemplateIdentity
  behaviour: TemplateBehaviour
  actions: string[]
  knowledge: string[]
  channels: string[]
}

export interface TestMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ─── Paginated API response ──────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface AgentListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: AgentStatus
  agentType?: string
}

// ─── Chat response from mock engine ──────────────────────────────────────────

export interface ChatResponse {
  content: string
  confidence: number
}

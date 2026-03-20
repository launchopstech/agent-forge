export type AgentStatus = 'live' | 'draft' | 'paused'

export type AgentChannel = 'Web' | 'WhatsApp' | 'Slack' | 'Email' | 'SMS'

export interface Agent {
  id: string
  name: string
  channels: AgentChannel[]
  conversations: number
  resolution: number | null
  csat: number | null
  status: AgentStatus
}

export interface TemplateIdentity {
  name: string
  welcomeMessage: string
  tone: 'professional' | 'friendly' | 'formal' | 'casual'
  language: string
}

export interface TemplateBehaviour {
  systemPrompt: string
  responseStyle: number // 0–100 (concise → detailed)
  fallback: 'handoff' | 'ticket' | 'email'
}

export interface AgentTemplate {
  id: string
  name: string
  emoji: string
  category: string
  description: string
  identity: TemplateIdentity
  behaviour: TemplateBehaviour
  actions: string[]
  knowledge: string[]
  channels: string[]
}

export interface DashboardMetrics {
  totalConversations: number
  totalConversationsChange: number
  resolutionRate: number
  resolutionRateChange: number
  handoffRate: number
  handoffRateChange: number
  avgResponseTime: string
  avgResponseTimeChange: number
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

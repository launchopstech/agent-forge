// ─── Channel Types ─────────────────────────────────────────────────────────────

export type ChannelType = 'test' | 'webhook' | 'slack' | 'email' | 'sms' | 'whatsapp' | 'website'

export type ChannelStatus = 'active' | 'paused' | 'error'

// ─── Catalog ───────────────────────────────────────────────────────────────────

export interface ChannelCatalogItem {
  type: ChannelType
  name: string
  iconSlug: string
  capabilities: string[]
  configSchema: Record<string, unknown>
  setupInstructions: string
}

// ─── Workspace Channels ────────────────────────────────────────────────────────

export interface WorkspaceChannel {
  id: string
  orgId: string
  channelType: ChannelType
  name: string
  config: Record<string, unknown>
  webhookSecret: string | null
  status: ChannelStatus
  workspaceInstructions: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateChannelPayload {
  channelType: ChannelType
  name: string
  config?: Record<string, unknown>
  webhookSecret?: string
  workspaceInstructions?: string
}

export interface UpdateChannelPayload {
  name?: string
  config?: Record<string, unknown>
  webhookSecret?: string
  status?: ChannelStatus
  workspaceInstructions?: string
}

// ─── Routing Rules ─────────────────────────────────────────────────────────────

/** Typed condition value for keyword-based routing rules. */
export interface KeywordConditionValue {
  keywords: string[]
}

export interface RoutingRule {
  id: string
  workspaceChannelId: string
  orgId: string
  priority: number
  conditionType: string
  conditionValue: KeywordConditionValue | Record<string, unknown>
  agentId: string
  agentInstructions: string | null
  createdAt: string
}

export interface CreateRoutingRulePayload {
  priority?: number
  conditionType: string
  conditionValue?: KeywordConditionValue | Record<string, unknown>
  agentId: string
  agentInstructions?: string
}

export interface ReplaceRoutingRulesPayload {
  rules: CreateRoutingRulePayload[]
}

// ─── Test Console ──────────────────────────────────────────────────────────────

export interface TestTriggerPayload {
  text: string
  fromId?: string
}

export interface TestTriggerResult {
  ok: boolean
  conversationId?: string
  reply?: string
  agentId?: string
  reason?: string
}

// ─── Test Console message log ──────────────────────────────────────────────────

export interface ConsoleMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

// ─── Channel Conversations ─────────────────────────────────────────────────────

export interface ChannelConversation {
  id: string
  orgId: string
  agentId: string
  workspaceChannelId: string
  title: string | null
  externalUserRef: string | null
  createdAt: string
  updatedAt: string
}

export interface ChannelConversationsResponse {
  data: ChannelConversation[]
  total: number
}

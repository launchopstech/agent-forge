import { apiClient, ApiError } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'
import type {
  ChannelCatalogItem,
  WorkspaceChannel,
  CreateChannelPayload,
  UpdateChannelPayload,
  RoutingRule,
  CreateRoutingRulePayload,
  ReplaceRoutingRulesPayload,
  ChannelConversationsResponse,
  TestTriggerPayload,
  TestTriggerResult,
} from '../types'

function redirect401(err: unknown): void {
  if (err instanceof ApiError && err.status === 401) {
    window.location.href = '/login'
  }
}

const opts = { getToken: getAccessToken, cache: 'no-store' as const }

// ─── Catalog ───────────────────────────────────────────────────────────────────

export async function fetchChannelCatalog(): Promise<ChannelCatalogItem[]> {
  return apiClient.get<ChannelCatalogItem[]>('/api/channels/catalog', opts)
}

// ─── Workspace Channels CRUD ───────────────────────────────────────────────────

export async function fetchChannels(): Promise<WorkspaceChannel[]> {
  try {
    return await apiClient.get<WorkspaceChannel[]>('/api/channels', opts)
  } catch (err) {
    redirect401(err)
    throw err
  }
}

export async function fetchChannel(id: string): Promise<WorkspaceChannel> {
  return apiClient.get<WorkspaceChannel>(`/api/channels/${id}`, opts)
}

export async function createChannel(payload: CreateChannelPayload): Promise<WorkspaceChannel> {
  return apiClient.post<WorkspaceChannel>('/api/channels', payload, opts)
}

export async function updateChannel(
  id: string,
  payload: UpdateChannelPayload
): Promise<WorkspaceChannel> {
  return apiClient.patch<WorkspaceChannel>(`/api/channels/${id}`, payload, opts)
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`/api/channels/${id}`, opts)
}

export async function validateChannelConfig(id: string): Promise<{ ok: boolean; error?: string }> {
  return apiClient.post(`/api/channels/${id}/validate`, {}, opts)
}

export async function fetchWebhookUrl(id: string): Promise<{ webhookUrl: string }> {
  return apiClient.get<{ webhookUrl: string }>(`/api/channels/${id}/webhook-url`, opts)
}

// ─── Routing Rules ─────────────────────────────────────────────────────────────

export async function fetchRoutingRules(channelId: string): Promise<RoutingRule[]> {
  return apiClient.get<RoutingRule[]>(`/api/channels/${channelId}/routing-rules`, opts)
}

export async function createRoutingRule(
  channelId: string,
  payload: CreateRoutingRulePayload
): Promise<RoutingRule> {
  return apiClient.post<RoutingRule>(`/api/channels/${channelId}/routing-rules`, payload, opts)
}

export async function deleteRoutingRule(channelId: string, ruleId: string): Promise<void> {
  await apiClient.delete(`/api/channels/${channelId}/routing-rules/${ruleId}`, opts)
}

export async function replaceRoutingRules(
  channelId: string,
  payload: ReplaceRoutingRulesPayload
): Promise<RoutingRule[]> {
  return apiClient.put<RoutingRule[]>(`/api/channels/${channelId}/routing-rules`, payload, opts)
}

export async function fetchChannelConversations(
  channelId: string,
  page = 1
): Promise<ChannelConversationsResponse> {
  return apiClient.get<ChannelConversationsResponse>(
    `/api/channels/${channelId}/conversations?page=${page}`,
    opts
  )
}

// ─── Test Console ──────────────────────────────────────────────────────────────

export async function triggerTest(
  channelId: string,
  payload: TestTriggerPayload
): Promise<TestTriggerResult> {
  return apiClient.post<TestTriggerResult>(`/api/channels/test/${channelId}/trigger`, payload, opts)
}

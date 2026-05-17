/**
 * Persistent conversations API client.
 * Wires to POST/GET /api/agents/:agentId/conversations[/:convId].
 * Pure fetch wrappers — no Next.js imports.
 */
import { apiClient } from '@forge/api-client'
import { getAccessToken } from '@forge/auth/client-registry'

const opts = { getToken: getAccessToken, cache: 'no-store' as const }

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversationSummary {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface ConversationDetail extends ConversationSummary {
  agentId: string
  messages: ConversationMessage[]
}

export interface SendMessageResponse {
  content: string
  usage: { inputTokens: number; outputTokens: number }
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function createConversation(
  agentId: string
): Promise<{ id: string; createdAt: string }> {
  return apiClient.post<{ id: string; createdAt: string }>(
    `/api/agents/${agentId}/conversations`,
    {},
    opts
  )
}

export async function fetchConversations(
  agentId: string,
  page = 1
): Promise<ConversationSummary[]> {
  return apiClient.get<ConversationSummary[]>(
    `/api/agents/${agentId}/conversations?page=${page}`,
    opts
  )
}

export async function fetchConversation(
  agentId: string,
  convId: string
): Promise<ConversationDetail> {
  return apiClient.get<ConversationDetail>(`/api/agents/${agentId}/conversations/${convId}`, opts)
}

export async function sendMessage(
  agentId: string,
  convId: string,
  message: string
): Promise<SendMessageResponse> {
  return apiClient.post<SendMessageResponse>(
    `/api/agents/${agentId}/conversations/${convId}/chat`,
    { message },
    opts
  )
}

export async function deleteConversation(agentId: string, convId: string): Promise<void> {
  await apiClient.delete(`/api/agents/${agentId}/conversations/${convId}`, opts)
}

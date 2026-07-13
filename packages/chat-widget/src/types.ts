export interface WidgetConfig {
  agentId: string
  shareToken: string
  apiUrl: string
  brandName: string
  brandColor: string
  mode: 'floating' | 'inline'
  position: 'bottom-right' | 'bottom-left'
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export const DEFAULTS: Omit<WidgetConfig, 'agentId' | 'shareToken'> = {
  apiUrl: 'https://api.mindrithm.ai',
  brandName: 'Mindrithm',
  brandColor: '#6366f1',
  mode: 'floating',
  position: 'bottom-right',
}

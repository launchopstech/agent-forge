import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BRAND_COLOR, normalizeBrandColor } from './styles'
import { ForgeChatElement } from './widget'

type WidgetAttributes = {
  agentId?: string
  shareToken?: string
  brandName?: string
  brandColor?: string
}

function renderWidget(attrs: WidgetAttributes = {}): HTMLElement {
  const el = document.createElement('forge-chat-test')
  el.dataset.agentId = attrs.agentId ?? 'agent_123'
  el.dataset.shareToken = attrs.shareToken ?? 'share_123'
  if (attrs.brandName !== undefined) el.dataset.brandName = attrs.brandName
  if (attrs.brandColor !== undefined) el.dataset.brandColor = attrs.brandColor
  document.body.appendChild(el)
  return el
}

describe('ForgeChatElement', () => {
  beforeAll(() => {
    vi.stubGlobal('__BRAND_URL__', 'https://mindrithm.ai')
    if (!customElements.get('forge-chat-test')) {
      customElements.define('forge-chat-test', ForgeChatElement)
    }
  })

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders brandName as text instead of HTML', () => {
    const el = renderWidget({ brandName: '<img src=x onerror=alert(1)> Acme' })
    const title = el.shadowRoot?.querySelector('.fc-header-title')

    expect(title?.textContent).toBe('<img src=x onerror=alert(1)> Acme')
    expect(title?.querySelector('img')).toBeNull()
  })

  it('falls back to the default color for invalid brand colors', () => {
    const el = renderWidget({ brandColor: 'red;}</style><script>alert(1)</script>' })
    const style = el.shadowRoot?.querySelector('style')

    expect(normalizeBrandColor('red;}</style><script>alert(1)</script>')).toBe(DEFAULT_BRAND_COLOR)
    expect(style?.textContent).toContain(`--fc-brand: ${DEFAULT_BRAND_COLOR};`)
    expect(style?.textContent).not.toContain('<script>')
  })

  it('uses the build-time brand URL global for attribution links', () => {
    const el = renderWidget()
    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>('.fc-brand-bar a')

    expect(link?.href).toBe('https://mindrithm.ai/')
  })
})

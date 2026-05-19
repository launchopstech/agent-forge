/**
 * Mindrithm Chat Widget — IIFE entry point
 *
 * Drop-in usage (all config via data-* attrs):
 * <script src="https://mindrithm.ai/widget.js"
 *   data-agent-id="<agentId>"
 *   data-share-token="<shareToken>"
 *   data-brand-name="Acme Inc"
 *   data-brand-color="#1a1a2e"
 * ></script>
 *
 * Inline mode (use <forge-chat> element directly):
 * <forge-chat data-mode="inline" data-agent-id="..." data-share-token="..."></forge-chat>
 */
import { ForgeChatElement } from './widget'

// Register the custom element if not already registered
if (!customElements.get('forge-chat')) {
  customElements.define('forge-chat', ForgeChatElement)
}

// Auto-init floating widget from <script> tag data-* attrs.
// Works with both classic <script src="..."> and Next.js <Script> component.
function autoInit() {
  // Prefer dataset on the currentScript (classic <script src>)
  const scriptEl = document.currentScript as HTMLScriptElement | null
  const dataset =
    scriptEl?.dataset ?? (window as unknown as Record<string, DOMStringMap>)['__FORGE_CHAT__']

  if (!dataset) return
  const agentId = (dataset as DOMStringMap)['agentId']
  const shareToken = (dataset as DOMStringMap)['shareToken']
  if (!agentId || !shareToken) return

  const mode = ((dataset as DOMStringMap)['mode'] ?? 'floating') as string

  if (mode === 'floating') {
    const existing = document.querySelector(
      'forge-chat[data-mode="floating"], forge-chat:not([data-mode])'
    )
    // Only auto-append if no floating widget already in DOM
    if (!existing) {
      const el = document.createElement('forge-chat')
      // Copy all data-* attrs from the script tag
      for (const [key, value] of Object.entries(dataset as DOMStringMap)) {
        el.dataset[key] = value
      }
      document.body.appendChild(el)
    }
  }
  // Inline widgets are already placed in the HTML — their connectedCallback handles init
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit)
} else {
  autoInit()
}

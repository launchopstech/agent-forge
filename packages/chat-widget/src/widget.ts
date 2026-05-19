import { DEFAULTS } from './types'
import type { ChatMessage, WidgetConfig } from './types'
import { streamChat } from './api'
import { buildStyles, normalizeBrandColor } from './styles'

const CHAT_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`
const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
const SEND_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`
const BOT_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 11H6V7h12v13zm-5-6h-2v-2h2v2zm-4 0H7v-2h2v2zm8 0h-2v-2h2v2z"/></svg>`
const EMPTY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`

function widgetMode(value: string | undefined): WidgetConfig['mode'] {
  return value === 'inline' ? 'inline' : DEFAULTS.mode
}

function widgetPosition(value: string | undefined): WidgetConfig['position'] {
  return value === 'bottom-left' ? 'bottom-left' : DEFAULTS.position
}

export class ForgeChatElement extends HTMLElement {
  private cfg?: WidgetConfig
  private shadow: ShadowRoot
  private messages: ChatMessage[] = []
  private isOpen = false
  private isStreaming = false
  private abortController?: AbortController

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    const ds = this.dataset
    if (!ds['agentId'] || !ds['shareToken']) {
      console.warn('[ForgeChat] data-agent-id and data-share-token are required')
      return
    }
    this.cfg = {
      agentId: ds['agentId'],
      shareToken: ds['shareToken'],
      apiUrl: ds['apiUrl'] ?? DEFAULTS.apiUrl,
      brandName: ds['brandName'] ?? DEFAULTS.brandName,
      brandColor: normalizeBrandColor(ds['brandColor']),
      mode: widgetMode(ds['mode']),
      position: widgetPosition(ds['position']),
    }
    this.render()
  }

  disconnectedCallback() {
    this.abortController?.abort()
  }

  private render() {
    if (!this.cfg) return
    const { brandColor, mode, position } = this.cfg

    this.shadow.innerHTML = `
      <style>${buildStyles(brandColor)}</style>
      ${mode === 'floating' ? this.floatingHTML(position) : this.inlineHTML()}
    `
    this.applyTextContent()
    this.bindEvents()
  }

  private floatingHTML(position: string) {
    const posClass = position === 'bottom-left' ? 'left' : ''
    return `
      <button class="fc-bubble ${posClass}" aria-label="Open chat">${CHAT_ICON}</button>
      <div class="fc-panel ${posClass}" role="dialog" aria-label="Chat with us">
        ${this.panelInnerHTML()}
      </div>
    `
  }

  private inlineHTML() {
    return `<div class="fc-inline">${this.panelInnerHTML()}</div>`
  }

  private panelInnerHTML() {
    return `
      <div class="fc-header">
        <div class="fc-header-avatar">${BOT_ICON}</div>
        <div>
          <div class="fc-header-title"></div>
          <div class="fc-header-sub">AI Assistant · Online</div>
        </div>
        ${this.cfg?.mode === 'floating' ? `<button class="fc-header-close" aria-label="Close chat">${CLOSE_ICON}</button>` : ''}
      </div>
      <div class="fc-messages" id="fc-messages">
        <div class="fc-empty">
          ${EMPTY_ICON}
          <p>Hi! How can I help you today?</p>
        </div>
      </div>
      <div class="fc-footer">
        <textarea
          class="fc-input"
          id="fc-input"
          placeholder="Type a message…"
          rows="1"
          aria-label="Message input"
        ></textarea>
        <button class="fc-send" id="fc-send" aria-label="Send message">${SEND_ICON}</button>
      </div>
      <div class="fc-brand-bar">Powered by <a href="${__BRAND_URL__}" target="_blank" rel="noopener">Mindrithm</a></div>
    `
  }

  private applyTextContent() {
    const title = this.shadow.querySelector<HTMLElement>('.fc-header-title')
    if (title) title.textContent = this.cfg?.brandName ?? DEFAULTS.brandName
  }

  private bindEvents() {
    const shadow = this.shadow

    // Floating: toggle on bubble click
    const bubble = shadow.querySelector<HTMLButtonElement>('.fc-bubble')
    if (bubble) {
      bubble.addEventListener('click', () => this.toggle())
    }

    // Close button
    const closeBtn = shadow.querySelector<HTMLButtonElement>('.fc-header-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close())
    }

    // Send button
    const sendBtn = shadow.getElementById('fc-send') as HTMLButtonElement | null
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.handleSend())
    }

    // Textarea: auto-resize + Enter to send
    const input = shadow.getElementById('fc-input') as HTMLTextAreaElement | null
    if (input) {
      input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          this.handleSend()
        }
      })
      input.addEventListener('input', () => {
        input.style.height = 'auto'
        input.style.height = `${Math.min(input.scrollHeight, 100)}px`
      })
    }

    // Inline: open immediately
    if (this.cfg?.mode === 'inline') {
      this.isOpen = true
    }
  }

  private toggle() {
    this.isOpen ? this.close() : this.open()
  }

  private open() {
    this.isOpen = true
    const panel = this.shadow.querySelector<HTMLElement>('.fc-panel')
    if (panel) panel.classList.add('open')
    const input = this.shadow.getElementById('fc-input') as HTMLTextAreaElement | null
    input?.focus()
  }

  private close() {
    this.isOpen = false
    const panel = this.shadow.querySelector<HTMLElement>('.fc-panel')
    if (panel) panel.classList.remove('open')
  }

  private async handleSend() {
    if (this.isStreaming || !this.cfg) return
    const input = this.shadow.getElementById('fc-input') as HTMLTextAreaElement | null
    if (!input) return
    const text = input.value.trim()
    if (!text) return

    input.value = ''
    input.style.height = 'auto'

    this.addMessage({ role: 'user', content: text })
    this.setStreaming(true)
    this.showTyping()

    this.abortController = new AbortController()
    const assistantEl = this.appendAssistantBubble()

    try {
      let first = true
      for await (const chunk of streamChat(this.cfg, this.messages, this.abortController.signal)) {
        if (first) {
          this.removeTyping()
          first = false
        }
        assistantEl.textContent += chunk
        this.scrollToBottom()
      }
      if (first) this.removeTyping() // empty response
      const lastContent = assistantEl.textContent ?? ''
      this.messages.push({ role: 'assistant', content: lastContent })
    } catch (err) {
      this.removeTyping()
      if ((err as Error).name !== 'AbortError') {
        assistantEl.textContent = 'Sorry, something went wrong. Please try again.'
      }
    } finally {
      this.setStreaming(false)
    }
  }

  private addMessage(msg: ChatMessage) {
    this.messages.push(msg)
    const container = this.shadow.getElementById('fc-messages')
    if (!container) return

    // Remove empty state on first message
    const empty = container.querySelector('.fc-empty')
    if (empty) empty.remove()

    const el = document.createElement('div')
    el.className = `fc-msg ${msg.role}`
    el.textContent = msg.content
    container.appendChild(el)
    this.scrollToBottom()
  }

  private appendAssistantBubble(): HTMLDivElement {
    const container = this.shadow.getElementById('fc-messages')!
    const el = document.createElement('div')
    el.className = 'fc-msg assistant'
    container.appendChild(el)
    this.scrollToBottom()
    return el
  }

  private showTyping() {
    const container = this.shadow.getElementById('fc-messages')
    if (!container) return
    const el = document.createElement('div')
    el.className = 'fc-typing'
    el.id = 'fc-typing'
    el.innerHTML = '<span></span><span></span><span></span>'
    container.appendChild(el)
    this.scrollToBottom()
  }

  private removeTyping() {
    this.shadow.getElementById('fc-typing')?.remove()
  }

  private scrollToBottom() {
    const container = this.shadow.getElementById('fc-messages')
    if (container) container.scrollTop = container.scrollHeight
  }

  private setStreaming(val: boolean) {
    this.isStreaming = val
    const sendBtn = this.shadow.getElementById('fc-send') as HTMLButtonElement | null
    if (sendBtn) sendBtn.disabled = val
    const input = this.shadow.getElementById('fc-input') as HTMLTextAreaElement | null
    if (input) input.disabled = val
  }
}

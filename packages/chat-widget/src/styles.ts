export const DEFAULT_BRAND_COLOR = '#6366f1'

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export function normalizeBrandColor(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_BRAND_COLOR

  const color = value.trim()
  return HEX_COLOR_RE.test(color) ? color.toLowerCase() : DEFAULT_BRAND_COLOR
}

export function buildStyles(brandColor: string): string {
  const safeBrandColor = normalizeBrandColor(brandColor)

  return `
    :host {
      --fc-brand: ${safeBrandColor};
      --fc-brand-dark: color-mix(in srgb, ${safeBrandColor} 80%, #000);
      --fc-bg: #ffffff;
      --fc-surface: #f9fafb;
      --fc-border: #e5e7eb;
      --fc-text: #111827;
      --fc-text-muted: #6b7280;
      --fc-radius: 12px;
      --fc-shadow: 0 20px 60px rgba(0,0,0,.15), 0 4px 16px rgba(0,0,0,.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-sizing: border-box;
    }

    *, *::before, *::after { box-sizing: border-box; }

    /* ── Floating button ─────────────────────────────────── */
    .fc-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--fc-brand);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(0,0,0,.25);
      transition: transform .15s, box-shadow .15s;
      z-index: 2147483640;
    }
    .fc-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,.3); }
    .fc-bubble svg { width: 24px; height: 24px; fill: #fff; }
    .fc-bubble.left { right: auto; left: 24px; }

    /* ── Panel ───────────────────────────────────────────── */
    .fc-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 360px;
      height: 520px;
      border-radius: var(--fc-radius);
      background: var(--fc-bg);
      box-shadow: var(--fc-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483639;
      transform: translateY(16px) scale(.97);
      opacity: 0;
      pointer-events: none;
      transition: transform .2s cubic-bezier(.16,1,.3,1), opacity .2s;
    }
    .fc-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: all;
    }
    .fc-panel.left { right: auto; left: 24px; }

    /* ── Inline mode ─────────────────────────────────────── */
    .fc-inline {
      width: 100%;
      height: 480px;
      border-radius: var(--fc-radius);
      background: var(--fc-bg);
      box-shadow: 0 2px 12px rgba(0,0,0,.08);
      border: 1px solid var(--fc-border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Header ──────────────────────────────────────────── */
    .fc-header {
      background: var(--fc-brand);
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .fc-header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .fc-header-avatar svg { width: 18px; height: 18px; fill: #fff; }
    .fc-header-title { font-weight: 600; font-size: 14px; }
    .fc-header-sub { font-size: 11px; opacity: .8; }
    .fc-header-close {
      margin-left: auto;
      background: none;
      border: none;
      cursor: pointer;
      color: #fff;
      opacity: .8;
      padding: 4px;
      border-radius: 4px;
      display: flex;
    }
    .fc-header-close:hover { opacity: 1; background: rgba(255,255,255,.15); }

    /* ── Messages ────────────────────────────────────────── */
    .fc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .fc-messages::-webkit-scrollbar { width: 4px; }
    .fc-messages::-webkit-scrollbar-track { background: transparent; }
    .fc-messages::-webkit-scrollbar-thumb { background: var(--fc-border); border-radius: 2px; }

    .fc-msg {
      max-width: 80%;
      padding: 9px 12px;
      border-radius: 12px;
      font-size: 13.5px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .fc-msg.user {
      align-self: flex-end;
      background: var(--fc-brand);
      color: #fff;
      border-bottom-right-radius: 3px;
    }
    .fc-msg.assistant {
      align-self: flex-start;
      background: var(--fc-surface);
      color: var(--fc-text);
      border: 1px solid var(--fc-border);
      border-bottom-left-radius: 3px;
    }

    /* ── Typing indicator ────────────────────────────────── */
    .fc-typing {
      align-self: flex-start;
      background: var(--fc-surface);
      border: 1px solid var(--fc-border);
      border-radius: 12px;
      border-bottom-left-radius: 3px;
      padding: 10px 14px;
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .fc-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--fc-text-muted);
      animation: fc-bounce .8s ease-in-out infinite;
    }
    .fc-typing span:nth-child(2) { animation-delay: .15s; }
    .fc-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes fc-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    .fc-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--fc-text-muted);
      gap: 8px;
      padding: 24px;
      text-align: center;
    }
    .fc-empty svg { width: 40px; height: 40px; opacity: .3; }
    .fc-empty p { font-size: 13px; margin: 0; }

    /* ── Input area ──────────────────────────────────────── */
    .fc-footer {
      border-top: 1px solid var(--fc-border);
      padding: 10px 12px;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      background: var(--fc-bg);
      flex-shrink: 0;
    }
    .fc-input {
      flex: 1;
      border: 1px solid var(--fc-border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13.5px;
      font-family: inherit;
      resize: none;
      min-height: 38px;
      max-height: 100px;
      outline: none;
      line-height: 1.5;
      color: var(--fc-text);
      background: var(--fc-bg);
      transition: border-color .15s;
    }
    .fc-input:focus { border-color: var(--fc-brand); }
    .fc-input::placeholder { color: var(--fc-text-muted); }
    .fc-send {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--fc-brand);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background .15s, opacity .15s;
    }
    .fc-send:hover { background: var(--fc-brand-dark); }
    .fc-send:disabled { opacity: .45; cursor: not-allowed; }
    .fc-send svg { width: 16px; height: 16px; fill: #fff; }

    /* ── Branding footer ─────────────────────────────────── */
    .fc-brand-bar {
      text-align: center;
      font-size: 10px;
      color: var(--fc-text-muted);
      padding: 4px 0 6px;
      flex-shrink: 0;
    }
    .fc-brand-bar a {
      color: var(--fc-brand);
      text-decoration: none;
    }
  `
}
